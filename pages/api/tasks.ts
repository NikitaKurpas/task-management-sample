import { applyMiddleware } from '../../utils/applyMiddleware'
import handleErrors from '../../backend/middleware/handleErrors'
import { getTaskService } from '../../backend/services/task'
import handleMethods from '../../backend/middleware/handleMethods'
import requiresAuth from '../../backend/middleware/requiresAuth'

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
