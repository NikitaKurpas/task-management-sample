import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../backend/middleware/handleErrors'
import { getUserService } from '../../../backend/services/user'
import handleMethods from '../../../backend/middleware/handleMethods'

const handler = handleMethods({
  POST: (req, res) => {
    const { body } = req
    const userService = getUserService()
    const createdUser = userService.createUser(body)
    res.status(201).json(createdUser)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
