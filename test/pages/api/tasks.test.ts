import handler from '../../../pages/api/tasks'
import { container } from 'tsyringe'
import { CreateTaskDAO, TaskService } from '../../../services/task'
import { Task } from '../../../types/common'
import { makeMockResponse, makeMockTask, makeMockUser } from '../../testUtils'

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiYWRtaW4iOmZhbHNlfQ.U8f93oTMm8-GjTS-X3yHarvmBt21D3E49J8cN1QBoVc'

const mockRequest = {
  url: '/api/tasks',
  method: 'GET',
  headers: {
    authorization: `Bearer ${testToken}`
  }
} as any
const mockResponse = makeMockResponse()
const mockTasks: Task[] = [makeMockTask(), makeMockTask(), makeMockTask()]
const mockService: Partial<TaskService> = {
  getTasks: jest.fn(() => mockTasks),
  createTask: jest.fn((task) => makeMockTask({
    assignees: task.assigneeIds.map(id => makeMockUser({ id })),
    description: task.description,
    status: task.status,
    createdBy: makeMockUser({ id: '123456', name: 'John Doe', email: 'john.doe@example.com' })
  }))
}

describe('GET /tasks', () => {
  beforeAll(() => {
    container.registerInstance(Symbol.for('TASK_SERVICE'), mockService)
  })
  afterAll(() => {
    container.reset()
  })

  it('should not respond with tasks when unauthorized', () => {
    handler({
      ...mockRequest,
      headers: {}
    }, mockResponse as any)

    expect(mockService.getTasks).not.toHaveBeenCalled()
  })

  it('should respond with all tasks when authorized', () => {
    handler(mockRequest, mockResponse as any)

    expect(mockService.getTasks).toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith(mockTasks)
  })
})

describe('POST /tasks', () => {
  beforeAll(() => {
    container.registerInstance(Symbol.for('TASK_SERVICE'), mockService)
  })
  afterAll(() => {
    container.reset()
  })

  it('should not create a task when unauthorized', () => {
    handler({
      ...mockRequest,
      headers: {}
    }, mockResponse as any)

    expect(mockService.createTask).not.toHaveBeenCalled()
  })

  it('should create and respond with new task when authorized', () => {
    const newTaskDao: CreateTaskDAO = {
      status: 'new',
      description: 'Fidelis tabes callide vitares fortis est.',
      assigneeIds: ['3', '5']
    }
    handler({
      ...mockRequest,
      method: 'POST',
      body: newTaskDao
    }, mockResponse as any)

    expect(mockService.createTask).toHaveBeenCalledWith(newTaskDao)
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: expect.any(String),
      status: 'new',
      description: 'Fidelis tabes callide vitares fortis est.',
      assignees: expect.arrayContaining([expect.objectContaining({ id: '3' }), expect.objectContaining({ id: '5' })]),
      createdBy: expect.objectContaining({
        id: '123456',
        name: 'John Doe',
      }),
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date)
    } as Task)
  })
})
