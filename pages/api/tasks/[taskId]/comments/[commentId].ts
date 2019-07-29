import { getCommentService } from '../../../../../backend/services/comment'
import { applyMiddleware } from '../../../../../utils/applyMiddleware'
import handleErrors from '../../../../../backend/middleware/handleErrors'
import handleMethods from '../../../../../backend/middleware/handleMethods'
import requiresAdmin from '../../../../../backend/middleware/requiresAdmin'

const handler = handleMethods({
  PUT: (req, res) => {
    const { body, query: { commentId } } = req
    const commentService = getCommentService()
    const updatedComment = commentService.updateCommentById(Array.isArray(commentId) ? commentId[0] : commentId, body)
    res.status(200).json(updatedComment)
  },
  DELETE: applyMiddleware(requiresAdmin)((req, res) => {
    const { query: { commentId } } = req
    const commentService = getCommentService()
    commentService.deleteCommentById(Array.isArray(commentId) ? commentId[0] : commentId)
    res.status(204).end()
  })
})

export default applyMiddleware(
  handleErrors()
)(handler)
