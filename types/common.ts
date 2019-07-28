import { NextApiRequest, NextApiResponse } from 'next'
import { Status } from '../services/task'
import { Role } from '../services/user'

export type NextHandler = (req: NextApiRequest, res: NextApiResponse) => any

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

export interface Task {
  id: string
  status: Status
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
