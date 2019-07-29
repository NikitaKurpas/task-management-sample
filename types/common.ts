import { NextApiRequest, NextApiResponse } from 'next'
import { Role } from '../services/user'

export type CustomNextApiRequest = NextApiRequest & {
  jwt?: Token
}

export type NextHandler = (req: CustomNextApiRequest, res: NextApiResponse) => any

export interface Token {
  sub: string
  name: string
  email: string
  admin: boolean
}

export interface User {
  id: string
  role: Role
  email: string
  name: string
}

export type TaskStatus = 'new' | 'in progress' | 'completed' | 'archived'

export interface Task {
  id: string
  status: TaskStatus
  description: string
  assignees: User[]
  createdAt: Date
  createdBy: User
  updatedAt: Date
}

export interface Comment {
  id: string
  author: User
  text: string
  task: Task
  createdAt: Date
  createdBy: User
  updatedAt: Date
}
