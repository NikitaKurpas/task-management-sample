# Task Manager App
A sample task management application

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
