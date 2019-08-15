import React from "react";
import { ITask } from "../../../../../common/types/common";
import { ArchiveButton, Container, Separator, Text } from "./Task.styled";
import { useAuth } from "../../../containers/Auth/Auth";
import IconButton from "../../atoms/IconButton/IconButton";
import { AssigneeControl } from "../../molecules/AssigneeControl/AssigneeControl";
import { TaskStatusControl } from "../../molecules/TaskStatusControl/TaskStatusControl";

const Task: React.FunctionComponent<{
  task: ITask;
  className?: string;
}> = ({ task, className }) => {
  const { tokenUser } = useAuth();
  const isAdmin = tokenUser ? tokenUser.admin : false;
  const displayedAssignees =
    task.assignees.length < 3 ? task.assignees : task.assignees.slice(0, 2);
  const hiddenAssignees =
    task.assignees.length < 3 ? [] : task.assignees.slice(2);

  return (
    <Container tabIndex={0} className={className}>
      <TaskStatusControl task={task} />
      <Text>{task.description}</Text>
      <Separator />
      <IconButton name="add" title="Add assignee to this task" />
      {displayedAssignees.map(assignee => (
        <AssigneeControl key={assignee.id} assignee={assignee} />
      ))}
      <ArchiveButton title="Archive this task" />
    </Container>
  );
};

export default Task;
