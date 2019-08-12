import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../auth/auth.dto';
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../roles.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../../common/types/common';

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
  async getUsers(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Get('me')
  async getProfile(@Request() req): Promise<IUser> {
    return this.userService.findOne((req.user as ReqUser).id);
  }

  @Put('me')
  async updateProfile(
    @Request() req,
    @Body() body: UpdateUserRequestDto,
  ): Promise<IUser> {
    const user = await this.userService.updateOne(
      (req.user as ReqUser).id,
      body,
    );

    if (!user) {
      throw new InternalServerErrorException(
        'Unexpected state. User should exist.',
      );
    }

    return user;
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<IUser> {
    return this.userService.findOne(userId);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateUserById(
    @Param('id') userId: string,
    @Body() body: UpdateUserRequestDto,
  ): Promise<IUser> {
    return await this.userService.updateOne(userId, body);
  }
}
