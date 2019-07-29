import { Comment } from '../types/common'
import { container } from 'tsyringe'

export interface CreateCommentDAO {
  authorId: string
  text: string
  taskId: string
}

export interface UpdateCommentDAO {
  text: string
}

export interface CommentService {
  getCommentsForTask(taskId: string): Comment[]

  createComment(comment: CreateCommentDAO): Comment

  updateCommentById(id: string, comment: UpdateCommentDAO): Comment

  deleteCommentById(id: string): Comment
}

const commentServiceToken = Symbol.for('COMMENT_SERVICE')

export const getCommentService = ():CommentService => container.resolve(commentServiceToken)
