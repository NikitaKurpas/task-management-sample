import handleMethods from '../../backend/middleware/handleMethods'
import { makeMockResponse } from '../testUtils'

const createMockRequest = (method: string = 'GET'): any => ({
  method,
  requestId: 145
})

const mockRequest = createMockRequest()
const mockResponse = makeMockResponse()

it('should call the respective method function based on request method', () => {
  handleMethods({
    GET: (req, res) => {
      res.end('Ok!')
    }
  })(mockRequest, mockResponse as any)

  expect(mockResponse.end).toHaveBeenCalledWith('Ok!')

  handleMethods({
    POST: (req, res) => {
      res.end('Correct!')
    }
  })(createMockRequest('POST'), mockResponse as any)

  expect(mockResponse.end).toHaveBeenCalledWith('Correct!')
})

it('should handle multiple request methods', () => {
  const handler = handleMethods({
    PUT: (req, res) => {
      res.end('Ok!')
    },
    POST: (req, res) => {
      res.end('Yep!')
    }
  })

  handler(createMockRequest('POST'), mockResponse as any)
  expect(mockResponse.end).toHaveBeenCalledWith('Yep!')

  handler(createMockRequest('PUT'), mockResponse as any)
  expect(mockResponse.end).toHaveBeenCalledWith('Ok!')
})

it('should respond with 405 and Allow header on incorrect method', () => {
  const handler = handleMethods({
    GET: (req, res) => {
      res.end('Ok!')
    }
  })

  handler(createMockRequest('POST'), mockResponse as any)
  expect(mockResponse.json).toHaveBeenCalledWith({
    message: 'Method POST Not Allowed'
  })
  expect(mockResponse.setHeader).toHaveBeenCalledWith('Allow', ['GET'])
})
