import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { Repository } from 'typeorm';
import { makeMockTask } from '../../test/utils/generators';
import { ReqUser } from '../auth/auth.dto';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';

const makeMockTaskRepository = (): Partial<Repository<Task>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});
const makeMockUserService = (): Partial<Repository<Task>> => ({
  findOne: jest.fn(),
});
const mockTasks = [makeMockTask(), makeMockTask()];

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: makeMockTaskRepository(),
        },
        UserService,
      ],
    })
      .overrideProvider(UserService)
      .useValue(makeMockUserService())
      .compile();

    service = module.get(TaskService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  it('#findAll should return all tasks', async () => {
    jest
      .spyOn(taskRepository, 'find')
      .mockImplementationOnce(async () => mockTasks);

    expect(await service.findAll()).toEqual(mockTasks);
  });

  it('#create should create a task with a new id, correct author, status, and assignees', async () => {
    const { createdBy } = mockTasks[0];
    const fields = {
      description: mockTasks[0].description,
      assigneeIds: mockTasks[0].assignees.map(({ id }) => id),
    };
    const reqUser: ReqUser = {
      id: createdBy.id,
      email: createdBy.email,
      name: createdBy.name,
      admin: false,
    };

    // noinspection ES6MissingAwait
    const expected = {
      id: expect.any(String),
      status: 'new' as TaskStatus,
      description: mockTasks[0].description,
      createdBy: { id: reqUser.id },
      assignees: fields.assigneeIds.map(id => ({ id })),
      comments: [],
      _comments: Promise.resolve([]),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    jest
      .spyOn(taskRepository, 'save')
      .mockImplementationOnce(async () => expected as any);

    expect(await service.create(fields, reqUser)).toEqual(expected);
    expect(taskRepository.save).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'new' as TaskStatus,
      description: mockTasks[0].description,
      createdBy: { id: reqUser.id },
      assignees: fields.assigneeIds.map(id => ({ id })),
      comments: [],
    });
  });

  it('#findOne should return a specific task', async () => {
    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => mockTasks[0]);

    expect(await service.findOne(mockTasks[0].id)).toEqual(mockTasks[0]);
    expect(taskRepository.findOne).toHaveBeenCalledWith(mockTasks[0].id);
  });

  it('#findOne should throw NotFound exception if the task is not found', async () => {
    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => undefined);

    await expect(service.findOne(mockTasks[0].id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('#updateOne should update the task with correct assignees', async () => {
    const fields = {
      status: 'in progress' as Exclude<TaskStatus, 'archived'>,
      description: mockTasks[1].description,
    };
    const expected = {
      ...mockTasks[0],
      status: 'in progress' as TaskStatus,
      description: mockTasks[1].description,
    };

    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => mockTasks[0]);
    jest
      .spyOn(taskRepository, 'save')
      .mockImplementationOnce(async () => expected);

    expect(await service.updateOne(mockTasks[0].id, fields)).toEqual(expected);
    expect(taskRepository.findOne).toHaveBeenCalledWith(mockTasks[0].id);
    expect(taskRepository.save).toHaveBeenCalledWith(expected);
  });

  it('#updateOne should throw NotFound exception if the task is not found', async () => {
    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => undefined);

    await expect(service.updateOne(mockTasks[0].id, {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('#archiveOne should update the status of the task to archived', async () => {
    const expected = {
      ...mockTasks[0],
      status: 'archived' as TaskStatus,
    };

    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => mockTasks[0]);
    jest
      .spyOn(taskRepository, 'save')
      .mockImplementationOnce(async () => expected);

    expect(await service.archiveOne(mockTasks[0].id)).toEqual(expected);
    expect(taskRepository.save).toHaveBeenCalledWith(expected);
  });

  it('#archiveOne should throw NotFound if the task is not found', async () => {
    jest
      .spyOn(taskRepository, 'findOne')
      .mockImplementationOnce(async () => undefined);

    await expect(service.archiveOne(mockTasks[0].id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('#addAssigneeToTask should add the assignee to task', async () => {});

  it('#removeAssigneeFromTask should add the assignee to task', async () => {});
});
