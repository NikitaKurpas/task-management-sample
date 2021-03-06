# Task Manager App

### [WIP]
A sample task management application written in Next.js (Frontend) and Nest.js (Backend)

<img width="700" alt="Tasks" src="https://user-images.githubusercontent.com/2844046/63120322-6022a080-bfa2-11e9-824b-58cffc12c32b.png" >

<img width="700" alt="Comments" src="https://user-images.githubusercontent.com/2844046/63120664-02db1f00-bfa3-11e9-865f-0d792f52fd04.png">


## Used technologies

- Docker, Docker Compose
- Nginx
- Node.js
- [Next.js](https://nextjs.org/)
- React
- Styled Components
- [Nest.js](https://nestjs.com/)
- PostgreSQL

## How to run

### Docker

```shell script
docker-compose up --build
```

Docker Compose will start backend, frontend, database, and reverse proxy.

The app will be available on `localhost:8080`. Frontend is mounted on `/`, and API is mounted on `/api/`.

The UI component sink page is available at `/sink`

### Node.js

Prerequisites: Node.js >= 10, npm >= 6

### Frontend

```shell script
cd frontend
npm ci # install from package-lock.json
npm run dev # start the dev server
```

App will be available on `localhost:3000`

The UI component sink page is available at `/sink`

### Backend

```shell script
cd backend
npm ci # install from package-lock.json
npm run start:dev # start the dev server
```

App will be available on `localhost:3005`

## Run tests

For both projects

```shell script
npm run test
```

## Folder structure

- `/fronted` - contains code for the frontend
- `/backend` - contains code for the backend
- `/proxy` - contains Nginx reverse proxy configuration

## REST API

- `POST /auth/register` - create and register a user
- `POST /auth/login` - generate a JWT based on email and password
- `GET /users` - get a list of all users
- `GET /users/:id` - get a specific user
- `PUT /users/:id` - update a user (admins only)
- `GET /users/me` - get currently logged in user
- `PUT /users/me` - update currently logged in user
- `GET /tasks` - get a list of all tasks
- `POST /tasks` - create a new task 
- `GET /tasks/:taskId` - get a task
- `PUT /tasks/:taskId` - update a task
- `POST /tasks/:taskId/archive` - archive a task (admins only)
- `PUT /tasks/:taskId/assignees/:assigneeId` - add assignee to task
- `DELETE /tasks/:taskId/assignees/:assigneeId` - remove assignee from task
- `GET /tasks/:taskId/comments` - get a list of all comments for the task
- `POST /tasks/:taskId/comments` - create a comment for the task
- `PUT /tasks/:taskId/comments/:commentId` - update a comment
- `DELETE /tasks/:taskId/comments/:commentId` - delete a comment (admins only)

## TODO

- [x] Write backend API mock
- [x] Write tests for the API
- [x] Link API to a DB
- [ ] Write frontend in React [WIP]
- [ ] Write tests for frontend
- [ ] Write OpenAPI docs
- [x] Write remaining tests for the API

## Goal of this project

- Write a sample app that showcases my skills as Full Stack JavaScript Software Engineer.
- Experiment with Next.js and Nest.js

<br>

You can find some of my other projects here: https://github.com/ethericlab 

Feel free to reach me at: https://www.linkedin.com/in/nikita-kurpas/
