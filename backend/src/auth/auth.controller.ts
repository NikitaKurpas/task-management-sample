import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class TokenResponseDto {
  readonly token: string;
}

export class RegisterRequestDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @IsNotEmpty()
  readonly password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<TokenResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<User> {
    return this.userService.create(body);
  }
}
