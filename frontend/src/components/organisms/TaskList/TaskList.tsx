import React from "react";
import { useApiRead } from "../../../containers/API/APIReadRequest";
import { ITask } from "../../../../../common/types/common";
import { TaskListView } from "./TaskListView";

const TaskList: React.FunctionComponent = () => {
  const { data, loading, error } = useApiRead<ITask[]>("/tasks", {
    fetchProtectedOnly: true
  });
  return <TaskListView loading={loading} error={error} tasks={data} />;
};

export default TaskList;
