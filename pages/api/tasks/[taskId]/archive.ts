import { container } from 'tsyringe'
import { TaskService, taskServiceToken } from '../../../../services/task'
import handleMethods from '../../../../middleware/handleMethods'
import { applyMiddleware } from '../../../../utils/applyMiddleware'
import handleErrors from '../../../../middleware/handleErrors'
import requiresAuth from '../../../../middleware/requiresAuth'
import requiresAdmin from '../../../../middleware/requiresAdmin'

let taskService: TaskService = container.resolve(taskServiceToken)

const handler = handleMethods({
  // Archive task by id
  POST: (req, res) => {
    const { query: { taskId } } = req
    const archivedTask = taskService.archiveTaskById(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(archivedTask)
  }
})

export default applyMiddleware(
  handleErrors(),
  requiresAdmin
)(handler)
