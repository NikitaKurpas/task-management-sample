import { applyMiddleware } from '../../../../utils/applyMiddleware'
import handleErrors from '../../../../middleware/handleErrors'
import { CommentService, commentServiceToken } from '../../../../services/comment'
import { container } from 'tsyringe'
import handleMethods from '../../../../middleware/handleMethods'

let commentService: CommentService = container.resolve(commentServiceToken)

const handler = handleMethods({
  GET: (req, res) => {
    const { query: { taskId } } = req
    const comments = commentService.getCommentsForTask(Array.isArray(taskId) ? taskId[0] : taskId)
    res.status(200).json(comments)
  },
  POST: (req, res) => {
    const { body, query: { taskId }, } = req
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
