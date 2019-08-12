import { IsArray, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { TaskStatus } from '../../../common/types/common'

export class CreateTaskDto {
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  readonly assigneeIds?: string[];

  @IsNotEmpty()
  readonly description: string;
}

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @Matches(
    new RegExp(
      (['new', 'in progress', 'completed'] as TaskStatus[]).join('|'),
      'i',
    ),
  )
  readonly status?: Exclude<TaskStatus, 'archived'>;

  @IsOptional()
  @IsNotEmpty()
  readonly description?: string;
}
