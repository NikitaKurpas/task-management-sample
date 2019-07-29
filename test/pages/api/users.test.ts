import handler from '../../../pages/api/users'
import { container } from 'tsyringe'
import { UserService, userServiceToken } from '../../../services/user'
import { User } from '../../../types/common'
import { makeMockResponse } from '../../testUtils'

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiYWRtaW4iOmZhbHNlfQ.U8f93oTMm8-GjTS-X3yHarvmBt21D3E49J8cN1QBoVc'

const mockRequest = {
  url: '/api/users',
  method: 'GET',
  headers: {
    authorization: `Bearer ${testToken}`
  }
} as any
const mockResponse = makeMockResponse()
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', role: 'user', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Doe', role: 'administrator', email: 'jane.doe@example.com' }
]

describe('GET /users', () => {
  beforeAll(() => {
    container.registerInstance(userServiceToken, {
      getUsers(): User[] {
        return mockUsers
      }
    } as Partial<UserService>)
  })
  afterAll(() => {
    container.reset()
  })

  it('should not respond with users when unauthorized', () => {
    handler({
      ...mockRequest,
      headers: {}
    }, mockResponse as any)

    expect(mockResponse.json).not.toHaveBeenCalledWith(mockUsers)
  })

  it('should respond with all users when authorized', () => {
    handler(mockRequest, mockResponse as any)

    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers)
  })
})
