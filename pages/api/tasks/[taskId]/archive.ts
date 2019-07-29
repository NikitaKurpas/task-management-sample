import { getTaskService } from '../../../../services/task'
import handleMethods from '../../../../middleware/handleMethods'
import { applyMiddleware } from '../../../../utils/applyMiddleware'
import handleErrors from '../../../../middleware/handleErrors'
import requiresAdmin from '../../../../middleware/requiresAdmin'

const handler = handleMethods({
  // Archive task by id
  POST: (req, res) => {
    const { query: { taskId } } = req
    const taskService = getTaskService()
    const archivedTask = taskService.archiveTaskById(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(archivedTask)
  }
})

export default applyMiddleware(
  handleErrors(),
  requiresAdmin
)(handler)
