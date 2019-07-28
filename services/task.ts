import { Task } from '../types/common'
// import uniqid from 'uniqid'
// import tasks from '../pages/api/tasks'
// import { func } from 'prop-types'

export type Status = 'new' | 'in progress' | 'completed' | 'archived'

export interface CreateTaskDAO {
  status: Omit<Status, 'archived'>
  description: string
  assigneeIds: string[]
}

export interface UpdateTaskDAO {
  status?: Omit<Status, 'archived'>
  description?: string
  assigneeIds?: string[]
}

export interface TaskService {
  getTasks(): Task[]
  getTaskById(id: string): Task
  getTasksForUser(userId: string): Task[]
  createTask(task: CreateTaskDAO): Task
  updateTaskById(id: string, task: UpdateTaskDAO): Task
  archiveTaskById(id: string): Task
}

export const taskServiceToken = Symbol('TASK_SERVICE')

// interface _InternalTask extends _Task {
//   assignees: string[]
// }
//
// const _storage: { [ id: string ]: _InternalTask } = {}
//
// export const getTasks = () => Object.values(_storage)
//
// export const getTaskById = (taskId: string) => _storage[ taskId ]
//
// export const getTasksForUser = (userId: string) => Object.values(_storage).filter(task => task.assignees.includes(userId))
//
// export const createTask = (task: Partial<Omit<Task, 'id'>>) => {
//   const id = uniqid()
//
//   _storage[ id ] = {
//     // specify defaults
//     id,
//     status: 'new',
//     description: '',
//
//     // unpack overrides
//     ...task,
//
//     // process assignees
//     assignees: extractUserIds(task.assignees)
//   }
//
//   return _storage[ id ]
// }
//
// export const updateTask = (taskId: string, task: Partial<Omit<Task, 'id'>>) => {
//   _storage[ taskId ] = {
//     ..._storage[ taskId ],
//     ...task,
//     assignees: extractUserIds(task.assignees)
//   }
// }
//
// function extractUserIds(users: User[] = []): string[] {
//   return users.map(user => user.id)
// }
