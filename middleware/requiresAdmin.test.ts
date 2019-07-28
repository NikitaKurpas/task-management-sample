import { _testRequiresAdmin } from './requiresAdmin'

const mockResponse = {
  status: jest.fn(() => mockResponse),
  end: jest.fn(() => mockResponse),
  json: jest.fn(() => mockResponse),
  setHeader: jest.fn(() => mockResponse)
} as any

it('should allow the handler to pass when the user is admin', () => {
  _testRequiresAdmin((req, res) => res.end('Passed!'))({
    jwt: {
      admin: true
    }
  } as any, mockResponse)

  expect(mockResponse.end).toHaveBeenCalledWith('Passed!')
})

it('should not allow the handler to execute when the user is not admin', () => {
  _testRequiresAdmin((req, res) => res.end('Passed!'))({
    jwt: {
      admin: false
    }
  } as any, mockResponse)

  expect(mockResponse.end).not.toHaveBeenCalledWith('Passed!')
  expect(mockResponse.status).toHaveBeenCalledWith(403)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'You shall not pass!'
  })
})
