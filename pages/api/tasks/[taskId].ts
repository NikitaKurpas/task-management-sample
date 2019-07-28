import { applyMiddleware } from '../../../utils/applyMiddleware'
import handleErrors from '../../../middleware/handleErrors'
import { TaskService, taskServiceToken } from '../../../services/task'
import handleMethods from '../../../middleware/handleMethods'
import { container } from 'tsyringe'

let taskService: TaskService = container.resolve(taskServiceToken)

const handler = handleMethods({
  // Get a task by id
  GET: (req, res) => {
    const { query: { taskId } } = req
    const task = taskService.getTaskById(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(task)
  },
  // Update a task by id
  PUT: (req, res) => {
    const {
      body, query: { taskId }
    } = req
    const createdTask = taskService.updateTaskById(Array.isArray(taskId) ? taskId[0] : taskId, body)
    res.status(200).json(createdTask)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
