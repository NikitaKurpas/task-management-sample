import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    let user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    let user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  async create(fields: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ email: fields.email })) {
      throw new ConflictException('Email already used');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(fields.password, salt);

    const user = new User(
      uniqid(),
      fields.email,
      passwordHash,
      fields.name,
      'user',
    );

    return this.userRepository.save(user);
  }

  async updateOne(
    id: string,
    fields: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return await this.userRepository.save({
      ...user,
      ...fields,
    });
  }
}
