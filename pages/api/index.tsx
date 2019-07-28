// Required import for tsyringe
import 'reflect-metadata'
import { NextApiRequest, NextApiResponse } from 'next'

// Bootstrap code

const handle = (req: NextApiRequest, res: NextApiResponse) => res.status(204).end()

export default handle
