import { applyMiddleware } from '../../../../utils/applyMiddleware'
import handleErrors from '../../../../middleware/handleErrors'
import { getCommentService } from '../../../../services/comment'
import handleMethods from '../../../../middleware/handleMethods'

const handler = handleMethods({
  GET: (req, res) => {
    const { query: { taskId } } = req
    const commentService = getCommentService()
    const comments = commentService.getCommentsForTask(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(comments)
  },
  POST: (req, res) => {
    const { body, query: { taskId }, } = req
    const commentService = getCommentService()
    const createdComment = commentService.createComment({
      ...body,
      taskId: Array.isArray(taskId) ? taskId[0] : taskId
    })
    res.status(201).json(createdComment)
  }
})

export default applyMiddleware(
  handleErrors()
)(handler)
