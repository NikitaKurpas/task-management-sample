import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request, NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task, TaskStatus } from './task.entity';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { TaskService } from './task.service';
import { IsArray, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ReqUser } from '../auth/auth.dto'

class CreateTaskDto {
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  readonly assigneeIds?: string[];

  @IsNotEmpty()
  readonly description: string;
}

class UpdateTaskDto {
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

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  readonly assigneeIds?: string[];
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Post()
  create(@Request() req, @Body() body: CreateTaskDto): Promise<Task> {
    return this.taskService.create(body, req.user as ReqUser);
  }

  @Get(':id')
  async findOne(@Param('id') taskId: string): Promise<Task> {
    const task = await this.taskService.findOne(taskId);

    if (!task) {
      throw new NotFoundException('Task does not exist')
    }

    return task
  }

  @Put(':id')
  async updateOne(
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    let task = await this.taskService.updateOne(taskId, body)

    if (!task) {
      throw new NotFoundException('Task does not exist')
    }

    return task;
  }

  @Post(':id/archive')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async archiveOne(@Param('id') taskId: string): Promise<Task> {
    let task = await this.taskService.archiveOne(taskId)

    if (!task) {
      throw new NotFoundException('Task does not exist')
    }

    return task;
  }
}
