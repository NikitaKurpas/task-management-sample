import React from "react";
import { ITask } from "../../../../../common/types/common";
import { useAuth } from "../../../containers/Auth/Auth";
import Router from "next/router";
import Task from "../Task/Task";

export const TaskListView: React.FunctionComponent<{
  tasks?: ITask[];
  loading: boolean;
  error?: Error;
}> = ({ tasks, loading, error }) => {
  const { loading: authLoading, user } = useAuth();

  if (!authLoading && !user) {
    Router.push("/login");
    return null;
  }

  if (loading || authLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  if (tasks == null) {
    return <h1>Error: tasks is undefined</h1>;
  }

  return (
    <ul>
      {tasks.map(task => (
        <Task task={task} as="li" />
      ))}
    </ul>
  );
};
