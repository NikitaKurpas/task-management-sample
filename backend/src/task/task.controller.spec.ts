import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { makeMockTask } from '../../test/utils/generators';
import { ReqUser } from '../auth/auth.dto';
import { TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

const makeMockTaskService = (): Partial<TaskService> => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  archiveOne: jest.fn(),
});
const mockTasks = [makeMockTask(), makeMockTask()];

describe('Task Controller', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(makeMockTaskService())
      .compile();

    controller = module.get(TaskController);
    taskService = module.get(TaskService);
  });

  it('#findAll should return all tasks', async () => {
    jest
      .spyOn(taskService, 'findAll')
      .mockImplementationOnce(async () => mockTasks);

    expect(await controller.findAll()).toEqual(mockTasks);
  });

  it('#create should create a task with correct user as author', async () => {
    const { createdBy } = mockTasks[0];
    const mockReqUser: ReqUser = {
      id: createdBy.id,
      admin: false,
      email: createdBy.email,
      name: createdBy.name,
    };
    const body = {
      status: 'new' as Exclude<TaskStatus, 'archived'>,
      description: mockTasks[0].description,
      assigneeIds: mockTasks[0].assignees.map(({ id }) => id),
    };

    jest
      .spyOn(taskService, 'create')
      .mockImplementationOnce(async () => mockTasks[0]);

    expect(await controller.create({ user: mockReqUser }, body)).toEqual(
      mockTasks[0],
    );
  });

  it('#findOne should return a specific task', async () => {
    jest
      .spyOn(taskService, 'findOne')
      .mockImplementationOnce(async () => mockTasks[0]);

    expect(await controller.findOne(mockTasks[0].id)).toEqual(mockTasks[0]);
  });

  it("#findOne should throw not found exception if task doesn't exist", async () => {
    jest
      .spyOn(taskService, 'findOne')
      .mockImplementationOnce(async () => undefined);

    await expect(controller.findOne(mockTasks[0].id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('#updateOne should update a task by id', async () => {
    const body = {
      description: 'New description',
    };
    const expected = {
      ...mockTasks[0],
      ...body,
    };

    jest
      .spyOn(taskService, 'updateOne')
      .mockImplementationOnce(async () => expected);

    expect(await controller.updateOne(mockTasks[0].id, body)).toEqual(expected);
  });

  it("#updateOne throw not found exception if task doesn't exist", async () => {
    const body = {
      description: 'New description',
    };

    jest
      .spyOn(taskService, 'updateOne')
      .mockImplementationOnce(async () => undefined);

    await expect(
      controller.updateOne(mockTasks[0].id, body),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('#archiveOne should change the status to archived of task found by id', async () => {
    jest.spyOn(taskService, 'archiveOne').mockImplementationOnce(async () => ({
      ...mockTasks[0],
      status: 'archived',
    }));

    expect(await controller.archiveOne(mockTasks[0].id)).toEqual({
      ...mockTasks[0],
      status: 'archived',
    });
  });

  it("#archiveOne should throw not found exception if task doesn't exist", async () => {
    await expect(controller.archiveOne(mockTasks[0].id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
