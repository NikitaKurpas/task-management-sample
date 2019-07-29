import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../middleware/handleErrors'
import { getUserService } from '../../../services/user'
import handleMethods from '../../../middleware/handleMethods'

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
