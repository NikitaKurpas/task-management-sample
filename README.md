# Task Manager App
A sample task management application

## How to run

Prerequisites: Node.js >= 10, npm >= 6

```shell script
npm ci # install from package-lock.json
npm run dev # start the dev server
```

## Run tests

```shell script
npm run test
```

## REST API

- `GET /api/users` - get a list of all users
- `POST /api/users/register` - create and register a user
- `POST /api/users/login` - generate a JWT based on email and password
- `GET /api/tasks` - get a list of all tasks
- `POST /api/tasks` - create a new task 
- `GET /api/tasks/:taskId` - get a task
- `PUT /api/tasks/:taskId` - update a task
- `POST /api/tasks/:taskId/archive` - archive a task (available to admins only)
- `GET /api/tasks/:taskId/comments` - get a list of all comments for the task
- `POST /api/tasks/:taskId/comments` - create a comment for the task
- `PUT /api/tasks/:taskId/comments/:commentId` - update a comment
- `DELETE /api/tasks/:taskId/comments/:commentId` - delete a comment (available to admins only)

## TODO

- [x] Write backend API mock
- [ ] Write tests for the API
- [ ] Link API to a DB
- [ ] Write frontend in React
- [ ] Write tests for frontend
- [ ] Update README
- [ ] Write OpenAPI 3 docs

## Goal of this project

- Write a sample app that showcases my skills as a Node.js Backend and React Frontend developer
- Experiment with Next.js 9's new features
