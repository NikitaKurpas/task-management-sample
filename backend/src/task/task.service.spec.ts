import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm'
import { Task, TaskStatus } from './task.entity'
import { Repository } from 'typeorm'
import { makeMockTask } from '../../test/utils/generators'
import { ReqUser } from '../auth/auth.dto'

const makeMockTaskRepository = (): Partial<Repository<Task>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  preload: jest.fn(),
  update: jest.fn()
})
const mockTasks = [makeMockTask(), makeMockTask()]

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, {
        provide: getRepositoryToken(Task),
        useValue: makeMockTaskRepository()
      }],
    }).compile();

    service = module.get(TaskService);
    taskRepository = module.get(getRepositoryToken(Task))
  });

  it('#findAll should return all tasks', async () => {
    jest.spyOn(taskRepository, 'find').mockImplementationOnce(async () => mockTasks)

    expect(await service.findAll()).toEqual(mockTasks)
  })

  it('#create should create a task with a new id, correct author, status, and assignees', async () => {
    const { createdBy } = mockTasks[0]
    const fields = {
      description: mockTasks[0].description,
      assigneeIds: mockTasks[0].assignees.map(({ id }) => id)
    }
    const reqUser: ReqUser = {
      id: createdBy.id,
      email: createdBy.email,
      name: createdBy.name,
      admin: false
    }

    jest.spyOn(taskRepository, 'preload').mockImplementationOnce(async () => ({
      ...mockTasks[0],
      id: 'generatedId',
      status: 'new'
    }))

    expect(await service.create(fields, reqUser)).toEqual({
      ...mockTasks[0],
      id: 'generatedId',
      status: 'new'
    })
    expect(taskRepository.insert).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'new',
      description: mockTasks[0].description,
      createdBy: { id: reqUser.id },
      assignees: fields.assigneeIds.map(id => ({ id }))
    })
    expect(taskRepository.preload).toHaveBeenCalled()
  })

  it('#findOne should return a specific task', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => mockTasks[0])

    expect(await service.findOne(mockTasks[0].id)).toEqual(mockTasks[0])
    expect(taskRepository.findOne).toHaveBeenCalledWith(mockTasks[0].id)
  })

  it('#findOne should return undefined if the task is not found', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => undefined)

    expect(await service.findOne(mockTasks[0].id)).toBeUndefined()
  })

  it('#updateOne should update the task with correct assignees', async () => {
    const fields = {
      status: 'in progress' as Exclude<TaskStatus, 'archived'>,
      description: mockTasks[1].description,
      assigneeIds: mockTasks[1].assignees.map(({ id }) => id)
    }
    const expected = {
      ...mockTasks[0],
      status: 'in progress' as TaskStatus,
      description: mockTasks[1].description,
      assignees: mockTasks[1].assignees
    }

    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => mockTasks[0])
    jest.spyOn(taskRepository, 'preload').mockImplementationOnce(async () => expected)

    expect(await service.updateOne(mockTasks[0].id, fields)).toEqual(expected)
    expect(taskRepository.findOne).toHaveBeenCalledWith(mockTasks[0].id)
    expect(taskRepository.update).toHaveBeenCalledWith({
      id: mockTasks[0].id
    }, {
      status: 'in progress',
      description: fields.description,
      assignees: fields.assigneeIds.map(id => ({ id }))
    })
    expect(taskRepository.preload).toHaveBeenCalled()
  })

  it('#updateOne should return undefined if the task is not found', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => undefined)

    expect(await service.updateOne(mockTasks[0].id, {})).toBeUndefined()
    expect(taskRepository.update).not.toHaveBeenCalled()
  })

  it('#archiveOne should update the status of the task to archived', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => mockTasks[0])

    expect(await service.archiveOne(mockTasks[0].id)).toEqual({
      ...mockTasks[0],
      status: 'archived'
    })
    expect(taskRepository.update).toHaveBeenCalledWith({
      id: mockTasks[0].id
    }, {
      status: 'archived'
    })
  })

  it('#archiveOne should return undefined if the task is not found', async () => {
    jest.spyOn(taskRepository, 'findOne').mockImplementationOnce(async () => undefined)

    expect(await service.archiveOne(mockTasks[0].id)).toBeUndefined()
    expect(taskRepository.update).not.toHaveBeenCalled()
  })
});
