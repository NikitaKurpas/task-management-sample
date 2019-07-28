import { CommentService, commentServiceToken } from '../../../../../services/comment'
import { applyMiddleware } from '../../../../../utils/applyMiddleware'
import handleErrors from '../../../../../middleware/handleErrors'
import { container } from 'tsyringe'
import handleMethods from '../../../../../middleware/handleMethods'
import requiresAdmin from '../../../../../middleware/requiresAdmin'

let commentService: CommentService = container.resolve(commentServiceToken)

const handler = handleMethods({
  PUT: (req, res) => {
    const { body, query: { commentId } } = req
    const updatedComment = commentService.updateCommentById(Array.isArray(commentId) ? commentId[0] : commentId, body)
    res.status(200).json(updatedComment)
  },
  DELETE: applyMiddleware(requiresAdmin)((req, res) => {
    const { query: { commentId } } = req
    commentService.deleteCommentById(Array.isArray(commentId) ? commentId[0] : commentId)
    res.status(204).end()
  })
})

export default applyMiddleware(
  handleErrors()
)(handler)
