import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import uniqid from 'uniqid';
import { ReqUser } from '../auth/auth.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import config from 'config';
import urlJoin from 'url-join';

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
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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
    // TODO: validate author and assignee ids against the database and preload them

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
    by: ReqUser,
  ): Promise<Task | undefined> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task does not exist.');
    }

    // Optimisation: dont update if the fields are empty
    if (!Object.keys(fields).length) {
      return task;
    }

    const result = await this.taskRepository.save({
      ...task,
      ...fields,
    });

    // Send mails asynchronously and don't wait for them to finish
    (async () => {
      try {
        await Promise.all(
          result.assignees
            .filter(assignee => assignee.id !== by.id) // Do not send emails for self
            .map(assignee =>
              this.mailService.sendMail({
                to: assignee.email,
                subject: 'Task updated',
                template: 'task-changed',
                context: {
                  name: assignee.name || assignee.email,
                  updater: by.name || by.email,
                  task: task.description,
                  url: urlJoin(config.get('frontendUrl'), `tasks/${result.id}`),
                },
              }),
            ),
        );
      } catch (err) {
        this.logger.error(err.message, err.stack);
      }
    })();

    return result;
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
