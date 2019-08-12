import React from "react";
import { useApiRead } from '../API/APIReadRequest'
import { ITask } from '../../../common/types/common'

export const TaskListView: React.FunctionComponent<{
  tasks?: ITask[]
  loading: boolean
  error?: Error
}> = ({ tasks, loading, error}) => {
  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error: ${error.message}</h1>
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
