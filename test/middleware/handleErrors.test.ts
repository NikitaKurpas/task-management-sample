import handleErrors, { makeErrorWithCode } from '../../middleware/handleErrors'
import { makeMockResponse } from '../testUtils'

const mockRequest = {
  requestId: 145
} as any
const mockResponse = makeMockResponse()

it('should catch errors and by default send message in response', () => {
  handleErrors()(() => {
    throw new Error('Boom!')
  })(mockRequest, mockResponse as any)

  expect(mockResponse.status).toHaveBeenCalledWith(500)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'Boom!',
    stack: expect.any(String)
  })
})

it('should catch errors and use custom code in response', () => {
  handleErrors()(() => {
    throw makeErrorWithCode('Boom!', 400)
  })(mockRequest, mockResponse as any)

  expect(mockResponse.status).toHaveBeenCalledWith(400)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'Boom!',
    stack: expect.any(String)
  })
})

it('should not interfere when no errors were thrown', () => {
  handleErrors()((req, res) => {
    res.end('Ok!')
  })(mockRequest, mockResponse as any)

  expect(mockResponse.end).toHaveBeenCalledWith('Ok!')
})

it('should catch errors and use custom error handler', () => {
  handleErrors((req, res, err) => {
    res.status(404).end(`[${(req as any).requestId}] Error: ${err.message}`)
  })(() => {
    throw new Error('Boom!')
  })(mockRequest, mockResponse as any)

  expect(mockResponse.status).toHaveBeenCalledWith(404)
  expect(mockResponse.end).toHaveBeenCalledWith('[145] Error: Boom!')
})

it('should generate errors with code', () => {
  const err = makeErrorWithCode('Boom!', 404)
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBe('Boom!')
  expect(err.code).toBe(404)
})
