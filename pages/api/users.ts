import { applyMiddleware } from '../../utils/applyMiddleware'
import { UserService, userServiceToken } from '../../services/user'
import handleErrors from '../../middleware/handleErrors'
import { container } from 'tsyringe'
import handleMethods from '../../middleware/handleMethods'
import requiresAuth from '../../middleware/requiresAuth'

const handler = handleMethods({
  // Get all users
  GET: (req, res) => {
    let userService: UserService = container.resolve(userServiceToken)
    const users = userService.getUsers()
    res.status(200).json(users)
  }
})


export default applyMiddleware(
  handleErrors(),
  requiresAuth
)(handler)
