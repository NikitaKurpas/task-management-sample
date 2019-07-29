import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from '../types/common'

type ErrorHandler = (req: NextApiRequest, res: NextApiResponse, err: ErrorWithCode) => any

type ErrorWithCode = Error & { code?: number }

const defaultErrorHandler: ErrorHandler = (req, res, err) => {
  const response: { message: string, stack?: string } = {
    message: err.message
  }

  if (['test', 'development'].includes(process.env.NODE_ENV)) {
    response.stack = err.stack
  }

  res.status(err.code || 500).json(response)
}

const handleErrors = (errorHandler: ErrorHandler = defaultErrorHandler) => (handler: NextHandler) => (req: NextApiRequest, res: NextApiResponse) => {
  try {
    handler(req, res)
  } catch (err) {
    errorHandler(req, res, err)
  }
}

export const makeErrorWithCode = (message: string, code: number) => {
  const err = new Error(message) as ErrorWithCode
  err.code = code
  return err
}

export default handleErrors
