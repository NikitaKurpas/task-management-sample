import { applyMiddleware } from '../../utils/applyMiddleware'
import { getUserService } from '../../backend/services/user'
import handleErrors from '../../backend/middleware/handleErrors'
import handleMethods from '../../backend/middleware/handleMethods'
import requiresAuth from '../../backend/middleware/requiresAuth'

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
