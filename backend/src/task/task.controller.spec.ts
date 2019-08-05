import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { makeMockTask, makeMockUser } from '../../test/utils/generators';
import { ReqUser } from '../auth/auth.dto';
import { TaskStatus } from './task.entity';
import { ForbiddenException } from '@nestjs/common';
import { CommentService } from '../comment/comment.service';

const makeMockTaskService = (): Partial<TaskService> => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  updateOne: jest.fn(),
  archiveOne: jest.fn(),
  addAssigneeToTask: jest.fn(),
  removeAssigneeFromTask: jest.fn(),
});
const makeMockCommentService = (): Partial<CommentService> => ({
  createForTask: jest.fn(),
});
const mockTasks = [makeMockTask(), makeMockTask()];
const mockUser = makeMockUser();

describe('Task Controller', () => {
  let controller: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, CommentService],
    })
      .overrideProvider(TaskService)
      .useValue(makeMockTaskService())
      .overrideProvider(CommentService)
      .useValue(makeMockCommentService())
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

  it('#updateOne should update a task by id', async () => {
    const mockReqUser: ReqUser = {
      id: '123',
      admin: false,
      email: 'john.doe@example.com',
      name: 'John Doe',
    };
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

    expect(
      await controller.updateOne(mockReqUser, mockTasks[0].id, body),
    ).toEqual(expected);
  });

  it('#updateOne throw ForbiddenException if status update is archived', async () => {
    const mockReqUser: ReqUser = {
      id: '123',
      admin: false,
      email: 'john.doe@example.com',
      name: 'John Doe',
    };
    const body = {
      description: 'New description',
      status: 'archived',
    };

    await expect(
      controller.updateOne(mockReqUser, mockTasks[0].id, body as any),
    ).rejects.toBeInstanceOf(ForbiddenException);
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

  it('#addAssigneeToTask should add assignee to task', async () => {
    const expected = {
      ...mockTasks[0],
      assignees: [...mockTasks[0].assignees, mockUser],
    };

    jest
      .spyOn(taskService, 'addAssigneeToTask')
      .mockImplementationOnce(async () => expected);

    expect(
      await controller.addAssigneeToTask(mockTasks[0].id, mockUser.id),
    ).toEqual(expected);
    expect(taskService.addAssigneeToTask).toHaveBeenCalledWith(
      mockTasks[0].id,
      mockUser.id,
    );
  });

  it('#removeAssigneeFromTask should add assignee to task', async () => {
    const expected = {
      ...mockTasks[0],
      assignees: [mockTasks[0].assignees[1]],
    };

    jest
      .spyOn(taskService, 'removeAssigneeFromTask')
      .mockImplementationOnce(async () => expected);

    expect(
      await controller.removeAssigneeFromTask(
        mockTasks[0].id,
        mockTasks[0].assignees[0].id,
      ),
    ).toEqual(expected);
    expect(taskService.removeAssigneeFromTask).toHaveBeenCalledWith(
      mockTasks[0].id,
      mockTasks[0].assignees[0].id,
    );
  });
});
