import { applyMiddleware } from '../../utils/applyMiddleware'
import { getUserService } from '../../services/user'
import handleErrors from '../../middleware/handleErrors'
import handleMethods from '../../middleware/handleMethods'
import requiresAuth from '../../middleware/requiresAuth'

const handler = handleMethods({
  // Get all users
  GET: (req, res) => {
    const userService = getUserService()
    const users = userService.getUsers()
    res.status(200).json(users)
  }
})


export default applyMiddleware(
  handleErrors(),
  requiresAuth
)(handler)
