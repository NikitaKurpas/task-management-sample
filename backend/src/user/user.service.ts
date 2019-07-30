import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import uniqid from 'uniqid';

export class CreateUserDto {
  readonly email: string;
  readonly name?: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly name?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async create(createUserDao: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ email: createUserDao.email })) {
      throw new ConflictException('Email already used');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDao.password, salt);

    const user = new User(
      uniqid(),
      createUserDao.email,
      passwordHash,
      createUserDao.name,
      'user',
    );

    return this.userRepository.save(user);
  }

  async updateOne(id: string, user: UpdateUserDto): Promise<void> {
    await this.userRepository.update(
      {
        id,
      },
      user,
    );
  }
}
