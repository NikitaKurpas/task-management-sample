import { _testRequiresAdmin } from '../../backend/middleware/requiresAdmin'
import { makeMockResponse } from '../testUtils'

const mockResponse = makeMockResponse()

it('should allow the handler to pass when the user is admin', () => {
  _testRequiresAdmin((req, res) => res.end('Passed!'))({
    jwt: {
      admin: true
    }
  } as any, mockResponse as any)

  expect(mockResponse.end).toHaveBeenCalledWith('Passed!')
})

it('should not allow the handler to execute when the user is not admin', () => {
  _testRequiresAdmin((req, res) => res.end('Passed!'))({
    jwt: {
      admin: false
    }
  } as any, mockResponse as any)

  expect(mockResponse.end).not.toHaveBeenCalledWith('Passed!')
  expect(mockResponse.status).toHaveBeenCalledWith(403)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'You shall not pass!'
  })
})
