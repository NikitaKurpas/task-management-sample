import React from "react";
import { useApiRead } from '../../../containers/API/APIReadRequest'
import { ITask } from '../../../../../common/types/common'
import { useAuth } from '../../../containers/Auth/Auth'
import Router from 'next/router'

export const TaskListView: React.FunctionComponent<{
  tasks?: ITask[]
  loading: boolean
  error?: Error
}> = ({ tasks, loading, error}) => {
  const { loading: authLoading, user } = useAuth()

  if (!authLoading && !user) {
    Router.push('/login')
    return null
  }

  if (loading || authLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error: {error.message}</h1>
  }

  if (tasks == null) {
    return <h1>Error: tasks is undefined</h1>
  }

  return (
    <ul>
      {tasks.map(task => (
        <li>{task.description}</li>
      ))}
    </ul>
  )
}

const TaskList: React.FunctionComponent = () => {
  const { data, loading, error} = useApiRead<ITask[]>('/tasks', { fetchProtectedOnly: true })
  return <TaskListView loading={loading} error={error} tasks={data} />
};

export default TaskList;
