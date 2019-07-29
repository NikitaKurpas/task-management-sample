import handler from '../../../pages/api/users'
import { container } from 'tsyringe'
import { UserService } from '../../../backend/services/user'
import { User } from '../../../types/common'
import { makeMockResponse, makeMockUser } from '../../testUtils'

const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiYWRtaW4iOmZhbHNlfQ.U8f93oTMm8-GjTS-X3yHarvmBt21D3E49J8cN1QBoVc'

const mockRequest = {
  url: '/api/users',
  method: 'GET',
  headers: {
    authorization: `Bearer ${testToken}`
  }
} as any
const mockResponse = makeMockResponse()
const mockUsers: User[] = [makeMockUser(), makeMockUser()]
const mockService: Partial<UserService> = {
  getUsers: jest.fn(() => mockUsers)
}

describe('GET /users', () => {
  beforeAll(() => {
    container.registerInstance(Symbol.for('USER_SERVICE'), mockService)
  })
  afterAll(() => {
    container.reset()
  })

  it('should not respond with users when unauthorized', () => {
    handler({
      ...mockRequest,
      headers: {}
    }, mockResponse as any)

    expect(mockService.getUsers).not.toHaveBeenCalled()
  })

  it('should respond with all users when authorized', () => {
    handler(mockRequest, mockResponse as any)

    expect(mockService.getUsers).toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers)
  })
})
