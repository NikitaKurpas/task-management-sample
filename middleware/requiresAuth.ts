import jwtAuth from 'micro-jwt-auth'
import config from 'config'

const requiresAuth = jwtAuth(config.get('jwtSecret'))

export default requiresAuth


