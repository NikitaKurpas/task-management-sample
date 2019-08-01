import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload, ReqUser } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: ReqUser): Promise<{ token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      admin: user.admin,
      name: user.name,
      email: user.email,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
