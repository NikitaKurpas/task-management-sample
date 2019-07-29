import { Task, TaskStatus, User } from '../types/common'

type MockedResponse = {
  status: jest.Mock
  end: jest.Mock
  json: jest.Mock
  setHeader: jest.Mock
  writeHead: jest.Mock
}

export const makeMockResponse = (): MockedResponse => {
  const result: MockedResponse = {
    status: jest.fn(() => result),
    end: jest.fn(() => result),
    json: jest.fn(() => result),
    setHeader: jest.fn(() => result),
    writeHead: jest.fn(() => result)
  }

  return result
}

export const makeMockUser = (overrides: Partial<User> = {}): User => {
  let randomId = overrides.id || getRandomInt(1, 100)
  return ({
    id: randomId.toString(),
    email: `user.${randomId}@example.com`,
    name: `User #${randomId}`,
    role: 'user',
    ...overrides
  })
}

export const makeMockTask = (overrides: Partial<Task> = {}): Task => {
  let randomId = overrides.id || getRandomInt(1, 100)
  return ({
    id: randomId.toString(),
    description: 'Lorem ipsum dolor sit amet',
    assignees: [makeMockUser(), makeMockUser()],
    status: (['archived', 'completed', 'in progress', 'new'] as TaskStatus[])[getRandomInt(0, 3)],
    createdAt: new Date(Date.now() + getRandomInt(1000, 10000)),
    createdBy: makeMockUser(),
    updatedAt: new Date(Date.now() + getRandomInt(11000, 50000)),
    ...overrides
  })
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
