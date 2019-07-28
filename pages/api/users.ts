import { applyMiddleware } from '../../utils/applyMiddleware'
import { UserService, userServiceToken } from '../../services/user'
import handleErrors from '../../middleware/handleErrors'
import { container } from 'tsyringe'
import handleMethods from '../../middleware/handleMethods'

let userService: UserService = container.resolve(userServiceToken)

const handler = handleMethods({
  // Get all users
  GET: (req, res) => {
    const users = userService.getUsers()
    res.status(200).json(users)
  }
})


export default applyMiddleware(
  handleErrors()
)(handler)
