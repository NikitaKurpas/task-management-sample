import { CustomNextApiRequest, NextHandler } from '../../types/common'
import { NextApiResponse } from 'next'
import requiresAuth from './requiresAuth'
import { compose } from '../../utils/compose'

const requiresAdmin = (handler: NextHandler) => (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (!req.jwt) {
    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }

  if (!req.jwt.admin) {
    return res.status(403).json({
      message: 'You shall not pass!'
    })
  }

  return handler(req, res)
}

export { requiresAdmin as _testRequiresAdmin }

export const isAdmin = (req: CustomNextApiRequest) => req.jwt && req.jwt.admin

export default compose(requiresAdmin, requiresAuth)
