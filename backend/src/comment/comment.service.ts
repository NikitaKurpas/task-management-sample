import { Injectable, NotFoundException } from '@nestjs/common';
import { ReqUser } from '../auth/auth.dto';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import uniqid from 'uniqid';
import { User } from '../user/user.entity';
import { TaskService } from '../task/task.service';

class UpsertCommentDto {
  text: string;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly taskService: TaskService,
  ) {}

  /**
   * Creates a comment for the task
   * @param taskId Id of the task to create the comment for
   * @param fields Fields of the new comment
   * @param by Author of the comment
   * @returns Created comment or undefined if the task is not found
   */
  async createForTask(
    taskId: string,
    fields: UpsertCommentDto,
    by: ReqUser,
  ): Promise<Comment> {
    const task = await this.taskService.findOne(taskId);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    const comment = new Comment(uniqid(), fields.text, task, {
      id: by.id,
    } as User);

    return await this.commentRepository.save(comment);
  }

  async updateOne(
    commentId: string,
    fields: UpsertCommentDto,
  ): Promise<Comment | undefined> {
    const comment = await this.commentRepository.findOne(commentId);

    if (!comment) {
      throw new NotFoundException('Comment does not exist.');
    }

    return await this.commentRepository.save({
      ...comment,
      ...fields,
    });
  }

  async deleteOne(commentId: string): Promise<void> {
    const result = await this.commentRepository.delete({ id: commentId });

    if (result.affected === 0) {
      throw new NotFoundException('Comment does not exist.');
    }
  }
}
