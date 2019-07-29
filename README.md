# Task Manager App
### [WIP]
A sample task management application written in Next.js 9 and React that utilises Next's new [API routes](https://github.com/zeit/next.js#api-routes).

## Used technologies

- Docker
- Node.js
- Next.js
- React

## How to run

### Docker

```shell script
docker-compose up --build
```

### Node.js

Prerequisites: Node.js >= 10, npm >= 6

```shell script
npm ci # install from package-lock.json
npm run dev # start the dev server
```

In both cases the app will be available on port 3000

## Run tests

```shell script
npm run test
```

## Folder structure

- `/config` - contains config for the app (using [`config`](https://github.com/lorenwest/node-config))
- `/middleware` - contains different middleware for use in Next's API routes
- `/pages` - contains frontend routes and pages
- `/pages/api` - contains API routes
- `/services` - contains backend services that have all the business logic
- `/types` - contains different TS type definitions
- `/utils` - contains different utilities
- `/test` - contains test files and test utilities

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
- [ ] Optimise folder structure
- [ ] Write frontend in React
- [ ] Write tests for frontend
- [ ] Update README
- [ ] Write OpenAPI 3 docs

## Goal of this project

- Write a sample app that showcases my skills as Full Stack JavaScript Software Engineer.
- Experiment with Next.js 9's new features
