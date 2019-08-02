import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import uniqid from 'uniqid';
import { ReqUser } from '../auth/auth.dto'

class CreateTaskDto {
  readonly description: string;
  readonly assigneeIds?: string[];
}

class UpdateTaskDto {
  readonly status?: Exclude<TaskStatus, 'archived'>;
  readonly description?: string;
  readonly assigneeIds?: string[];
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task | undefined> {
    return this.taskRepository.findOne(id);
  }

  async create(fields: CreateTaskDto, by: ReqUser): Promise<Task> {
    const task = new Task(
      uniqid(),
      'new',
      fields.description,
      { id: by.id } as User,
      (fields.assigneeIds || []).map(id => ({ id } as User)),
    );

    await this.taskRepository.insert(task);

    return await this.taskRepository.preload(task)
  }

  async updateOne(
    id: string,
    fields: UpdateTaskDto = {},
  ): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      return undefined;
    }

    // Optimisation: dont update if the fields are empty
    if (!Object.keys(fields).length) {
      return task
    }

    const { assigneeIds = [], ...rest } = fields;

    await this.taskRepository.update(
      { id },
      {
        ...rest,
        assignees: assigneeIds.map(id => ({ id })),
      },
    );

    return this.taskRepository.preload(task);
  }

  async archiveOne(id: string): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      return undefined;
    }

    await this.taskRepository.update(
      { id },
      {
        status: 'archived',
      },
    );

    return {
      ...task,
      status: 'archived',
    };
  }
}
