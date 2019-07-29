import { makeMockResponse, makeMockUser } from '../../../testUtils'
import { UserService } from '../../../../services/user'
import handler from '../../../../pages/api/users/login'
import { container } from 'tsyringe'
import jwt from 'jsonwebtoken'
import config from 'config'

const mockRequest: any = {
  url: '/api/login',
  method: 'POST',
  body: {
    email: 'user.1@example.com',
    password: 'testpassword'
  }
}
const mockResponse = makeMockResponse()
const mockService: Partial<UserService> = {
  verifyCredentials: jest.fn((email, password) => {
    return email === 'user.1@example.com' && password === 'testpassword' ? makeMockUser({
      id: '1',
      email
    }) : null
  })
}

describe('POST /login', () => {
  beforeAll(() => {
    container.registerInstance(Symbol.for('USER_SERVICE'), mockService)
  })
  afterAll(() => {
    container.reset()
  })
  it('should generate a JWT when the credentials are correct', () => {
    let token: string = ''
    mockResponse.json.mockImplementationOnce((body) => (token = body.token))
    handler(mockRequest, mockResponse as any)

    expect(mockService.verifyCredentials).toHaveBeenCalledWith('user.1@example.com', 'testpassword')
    expect(mockResponse.json).toHaveBeenCalled()
    // token should be the actual token by now
    expect(() => jwt.verify(token, config.get('jwtSecret'))).not.toThrow()
    expect(jwt.verify(token, config.get('jwtSecret'))).toMatchObject({
      sub: '1',
      email: 'user.1@example.com',
      name: 'User #1',
      admin: false
    })
  })

  it('should respond with 401 when the credentials are not correct', () => {
    handler({
      ...mockRequest,
      body: {
        email: 'john.doe@example.com',
        password: 'haxxxor'
      }
    }, mockResponse as any)

    expect(mockService.verifyCredentials).toHaveBeenCalledWith('john.doe@example.com', 'haxxxor')
    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Incorrect login credentials'
    })
  })
})
