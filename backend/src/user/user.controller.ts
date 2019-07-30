import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import jwt from 'jsonwebtoken';
import { UpdateUserDto, UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/auth.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('me')
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findOne((req.user as ReqUser).id);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.findOne(userId);
  }

  @Put(':id')
  async updateUserById(
    @Param('id') userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<void> {
    // TODO: validate body
    return this.userService.updateOne(userId, body);
  }
}
