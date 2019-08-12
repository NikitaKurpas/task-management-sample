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
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ITokenResponse } from '../../../common/types/common';

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
  async login(@Request() req): Promise<ITokenResponse> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<void> {
    await this.userService.create(body);
  }
}
