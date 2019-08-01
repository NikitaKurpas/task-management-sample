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
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/auth.dto';
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../roles.guard';
import { IsNotEmpty, IsString } from 'class-validator';

class UpdateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

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

  @Put('me')
  async updateProfile(
    @Request() req,
    @Body() body: UpdateUserRequestDto,
  ): Promise<void> {
    return this.userService.updateOne((req.user as ReqUser).id, body);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.findOne(userId);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateUserById(
    @Param('id') userId: string,
    @Body() body: UpdateUserRequestDto,
  ): Promise<void> {
    return this.userService.updateOne(userId, body);
  }
}
