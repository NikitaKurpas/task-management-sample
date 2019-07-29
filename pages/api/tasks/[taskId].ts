import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../backend/middleware/handleErrors'
import { getTaskService } from '../../../backend/services/task'
import handleMethods from '../../../backend/middleware/handleMethods'

const handler = handleMethods({
  // Get a task by id
  GET: (req, res) => {
    const { query: { taskId } } = req
    let taskService = getTaskService()
    const task = taskService.getTaskById(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(task)
  },
  // Update a task by id
  PUT: (req, res) => {
    const {
      body, query: { taskId }
    } = req
    let taskService = getTaskService()
    const createdTask = taskService.updateTaskById(Array.isArray(taskId) ? taskId[0] : taskId, body)
    res.status(200).json(createdTask)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
