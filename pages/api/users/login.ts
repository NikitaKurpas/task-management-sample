import handleMethods from '../../../middleware/handleMethods'
import jwt from 'jsonwebtoken'
import { UserService, userServiceToken } from '../../../services/user'
import { container } from 'tsyringe'
import { Token } from '../../../types/common'
import config from 'config'
import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../middleware/handleErrors'

const userService: UserService = container.resolve(userServiceToken)

const handler = handleMethods({
  POST: (req, res) => {
    const { body: { email, password } } = req

    const user = userService.verifyCredentials(email, password)

    if (!user) {
      return res.status(401).json({
        message: 'Incorrect login credentials'
      })
    }

    const payload: Token = {
      sub: user.id,
      admin: user.role === 'administrator',
      name: user.name,
      email: user.email
    }
    const token = jwt.sign(payload, config.get('jwtSecret'))
    return res.status(200).json({
      token
    })
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
