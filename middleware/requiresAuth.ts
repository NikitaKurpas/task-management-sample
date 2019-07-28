import jwtAuth from 'micro-jwt-auth'
import { NextHandler } from '../types/common'
import config from 'config'

const requiresAuth = jwtAuth(config.get('jwtSecret'))

export default requiresAuth


