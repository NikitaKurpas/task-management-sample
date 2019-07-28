import Joi from '@hapi/joi'
import { User } from '../types/common'

export type Role = 'user' | 'administrator'

const createUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string()
})

export interface CreateUserDAO {
  email: string
  name?: string
  password: string
}

export interface UpdateUserDAO {
  name?: string
}

export interface UserService {
  getUsers(): User[]
  getUserById(id: string): User

  createUser(user: CreateUserDAO): User

  updateUserById(id: string, user: UpdateUserDAO): User

  verifyCredentials(email: string, password: string): User | null
}

export const userServiceToken = Symbol('USER_SERVICE')
