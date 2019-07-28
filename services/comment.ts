import { Comment } from '../types/common'

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

export const commentServiceToken = Symbol('COMMENT_SERVICE')
