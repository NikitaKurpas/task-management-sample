import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards
} from '@nestjs/common';
import { Comment } from './comment.entity'
import { CommentService } from './comment.service'
import { IsNotEmpty } from 'class-validator'
import { Roles } from '../roles.decorator'
import { RolesGuard } from '../roles.guard'
import { AuthGuard } from '@nestjs/passport'

class UpdateTaskDto {
  @IsNotEmpty()
  text: string
}

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class TaskCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() body: UpdateTaskDto): Promise<Comment> {
    const comment = await this.commentService.updateOne(id, body)

    if (!comment) {
      throw new NotFoundException('Comment does not exist.')
    }

    return comment
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(RolesGuard)
  async deleteOne(@Param('id') id: string): Promise<void> {
    const isDeleted = await this.commentService.deleteOne(id)

    if (!isDeleted) {
      throw new NotFoundException('Comment does not exist.')
    }
  }
}
