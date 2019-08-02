import { Injectable } from '@nestjs/common';
import { ReqUser } from '../auth/auth.dto';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task/task.entity'
import uniqid from 'uniqid';
import { User } from '../user/user.entity'

class UpsertCommentDto {
  text: string;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
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
  ): Promise<Comment | undefined> {
    const task = await this.taskRepository.findOne(taskId)

    if (!task) {
      return undefined
    }

    const comment = new Comment(
      uniqid(),
      fields.text,
      task,
      { id: by.id } as User
    )

    await this.commentRepository.insert(comment)

    return this.commentRepository.preload(comment)
  }

  async updateOne(
    commentId: string,
    fields: UpsertCommentDto,
  ): Promise<Comment | undefined> {
    const comment = await this.commentRepository.findOne(commentId)

    if (!comment) {
      return undefined
    }

    await this.commentRepository.update({
      id: commentId
    }, {
      text: fields.text
    })

    return {
      ...comment,
      text: fields.text
    }
  }

  async deleteOne(commentId: string): Promise<boolean> {
    const result = await this.commentRepository.delete({ id: commentId })

    return result.affected !== 0
  }
}
