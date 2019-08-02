import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import uniqid from 'uniqid';
import { ReqUser } from '../auth/auth.dto';
import { UserService } from '../user/user.service';

class CreateTaskDto {
  readonly description: string;
  readonly assigneeIds?: string[];
}

class UpdateTaskDto {
  readonly status?: Exclude<TaskStatus, 'archived'>;
  readonly description?: string;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    let task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    task.comments = await task._comments;

    return task;
  }

  async create(fields: CreateTaskDto, by: ReqUser): Promise<Task> {
    // TODO: validate author and assignee ids against the database

    const task = new Task(
      uniqid(),
      'new',
      fields.description,
      { id: by.id } as User,
      (fields.assigneeIds || []).map(id => ({ id } as User)),
    );

    return await this.taskRepository.save(task);
  }

  async updateOne(
    id: string,
    fields: UpdateTaskDto = {},
  ): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    // Optimisation: dont update if the fields are empty
    if (!Object.keys(fields).length) {
      return task;
    }

    return this.taskRepository.save({
      ...task,
      ...fields,
    });
  }

  async archiveOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    task.status = 'archived';

    return await this.taskRepository.save(task);
  }

  async addAssigneeToTask(taskId: string, assigneeId: string): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    const user = await this.userService.findOne(assigneeId);

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    task.assignees.push(user);

    return this.taskRepository.save(task);
  }

  async removeAssigneeFromTask(
    taskId: string,
    assigneeId: string,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    task.assignees = task.assignees.filter(({ id }) => id !== assigneeId);

    return this.taskRepository.save(task);
  }
}
