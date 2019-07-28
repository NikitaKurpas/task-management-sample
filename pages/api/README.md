# APIs

This folder contains APIs for the task management system. It uses the Next.js 9 [API Routes](https://github.com/zeit/next.js#api-routes).

This API is mounted on `//api`.

## File and folder structure

`/index.ts` contains bootstrap code for the API backend

`/user.ts` contains API to retrieve all users

`/users/register.ts` contains API to create and register the user

`/task.ts` contains APIs to create a task and get all tasks

`/tasks/[taskId].ts` contains APIs to get and update a task

`/tasks/[taskId]/archive.ts` contains API to archive the task

`/tasks/[taskId]/comment.ts` contains APIs to create a comment for the task and get all comments

`/tasks/[taskId]/comments/[commentId].ts` contains APIs to update and delete a comment




