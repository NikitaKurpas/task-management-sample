import { NextHandler } from '../types/common'
import { compose } from './compose'

type Middleware = (handle: NextHandler) => NextHandler

export const applyMiddleware = (...middleware: Middleware[]) => (handler: NextHandler): NextHandler => {
  return compose(...middleware)(handler)
}
