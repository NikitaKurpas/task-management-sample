import { applyMiddleware } from '../../utils/applyMiddleware'
import handleErrors from '../../middleware/handleErrors'
import { TaskService, taskServiceToken } from '../../services/task'
import handleMethods from '../../middleware/handleMethods'
import { container } from 'tsyringe'

let taskService: TaskService = container.resolve(taskServiceToken)

const handler = handleMethods({
  // Get all tasks
  GET: (req, res) => {
    const tasks = taskService.getTasks()
    res.status(200).json(tasks)
  },
  // Create a task
  POST: (req, res) => {
    const { body } = req
    const createdTask = taskService.createTask(body)
    res.status(201).json(createdTask)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
