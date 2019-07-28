import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from '../types/common'

type ErrorHandler = (req: NextApiRequest, res: NextApiResponse, err: ErrorWithCode) => any

type ErrorWithCode = Error & { code?: number }

const defaultErrorHandler: ErrorHandler = (req, res, err) => {
  res.status(err.code || 500).json({
    message: err.message
  })
}

const handleErrors = (errorHandler: ErrorHandler = defaultErrorHandler) => (handler: NextHandler) => (req: NextApiRequest, res: NextApiResponse) => {
  try {
    handler(req, res)
  } catch (err) {
    errorHandler(req, res, err)
  }
}

export default handleErrors
