import handleErrors from './handleErrors'

const mockRequest = {
  requestId: 145
} as any
const mockResponse = {
  status: jest.fn(() => mockResponse),
  end: jest.fn(() => mockResponse),
  json: jest.fn(() => mockResponse)
} as any

it('should catch errors and by default send message in response', () => {
  handleErrors()(() => {
    throw new Error('Boom!')
  })(mockRequest, mockResponse)

  expect(mockResponse.status).toHaveBeenCalledWith(500)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'Boom!'
  })
})

it('should not interfere when no errors were thrown', () => {
  handleErrors()((req, res) => {
    res.end('Ok!')
  })(mockRequest, mockResponse)

  expect(mockResponse.end).toHaveBeenCalledWith('Ok!')
})

it('should catch errors and use custom error handler', () => {
  handleErrors((req, res, err) => {
    res.status(404).end(`[${(req as any).requestId}] Error: ${err.message}`)
  })(() => {
    throw new Error('Boom!')
  })(mockRequest, mockResponse)

  expect(mockResponse.status).toHaveBeenCalledWith(404)
  expect(mockResponse.end).toHaveBeenCalledWith('[145] Error: Boom!')
})
