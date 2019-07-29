import { applyMiddleware } from '../../utils/applyMiddleware'
import handleErrors from '../../middleware/handleErrors'
import { getTaskService } from '../../services/task'
import handleMethods from '../../middleware/handleMethods'
import requiresAuth from '../../middleware/requiresAuth'

const handler = handleMethods({
  // Get all tasks
  GET: (req, res) => {
    const taskService = getTaskService()
    const tasks = taskService.getTasks()
    res.status(200).json(tasks)
  },
  // Create a task
  POST: (req, res) => {
    const { body } = req
    const taskService = getTaskService()
    const createdTask = taskService.createTask(body)
    res.status(201).json(createdTask)
  }
})

export default applyMiddleware(
  handleErrors(),
  requiresAuth
)(handler)
