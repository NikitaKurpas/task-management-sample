import { NextHandler, Token } from '../types/common'
import { NextApiRequest, NextApiResponse } from 'next'
import requiresAuth from './requiresAuth'
import { compose } from '../utils/compose'

type ReqWithJwt = NextApiRequest & {
  jwt?: Token
}

const requiresAdmin = (handler: NextHandler) => (req: ReqWithJwt, res: NextApiResponse) => {
  if (!req.jwt) {
    return res.status(401).end({
      message: 'Unauthenticated'
    })
  }

  if (!req.jwt.admin) {
    return res.status(403).end({
      message: 'You shall not pass!'
    })
  }

  return handler(req, res)
}

export const isAdmin = (req: ReqWithJwt) => req.jwt && req.jwt.admin

export default compose(requiresAdmin, requiresAuth)
