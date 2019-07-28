import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from '../types/common'

export type MethodMap = {
  GET?: NextHandler
  POST?: NextHandler
  PUT?: NextHandler
  DELETE?: NextHandler
}

const handleMethods = (methods: MethodMap): NextHandler => {
  const allowedMethods = Object.keys(methods)

  return (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    if (method !== undefined && allowedMethods.includes(method)) {
      // @ts-ignore here because we don't want to create an index signature on the MethodMap type - that would allow
      // any property to be present on the object
      const handler = methods[method]
      return handler(req, res)
    } else {
      res.setHeader('Allow', allowedMethods)
      return res.status(405).json({
        message: `Method ${method} Not Allowed`
      })
    }
  }
}

export default handleMethods
