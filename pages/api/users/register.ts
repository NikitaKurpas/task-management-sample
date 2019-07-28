import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../middleware/handleErrors'
import { UserService, userServiceToken } from '../../../services/user'
import { container } from 'tsyringe'
import handleMethods from '../../../middleware/handleMethods'

let userService: UserService = container.resolve(userServiceToken)

const handler = handleMethods({
  POST: (req, res) => {
    const { body } = req
    const createdUser = userService.createUser(body)
    res.status(201).json(createdUser)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
