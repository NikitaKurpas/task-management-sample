import React, { useRef, useState } from "react";
import {
  ITask,
  IUser,
  TaskStatus as TaskStatusEnum
} from "../../../common/types/common";
import TaskStatus from "../TaskStatus/TaskStatus";
import {
  ArchiveButton,
  Container,
  Separator,
  Text,
  UserAvatar,
  DeleteButton,
  TaskStatusButton
} from "./TaskItem.styled";
import { useAuth } from "../Auth/Auth";
import IconButton from "../IconButton/IconButton";
import DropdownMenu, {
  useDismissibleDropdown
} from "../DropdownMenu/DropdownMenu";

const AssigneeControl: React.FunctionComponent<{ assignee: IUser }> = ({
  assignee
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useDismissibleDropdown(dropdownRef, open, setOpen);

  return (
    <DropdownMenu
      ref={dropdownRef}
      toggle={
        <UserAvatar
          email={assignee.email}
          title={assignee.name || assignee.email}
          size={80}
          tabIndex={0}
          onClick={() => setOpen(open => !open)}
        />
      }
      open={open}
    >
      <DeleteButton
        title={`Remove ${assignee.name || assignee.email} from this task`}
        onClick={() => setOpen(false)}
      />
    </DropdownMenu>
  );
};

const TaskStatusControl: React.FunctionComponent<{ task: ITask }> = ({
  task
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useDismissibleDropdown(dropdownRef, open, setOpen);

  if (task.status === 'archived') {
    return <TaskStatus status={task.status} />
  }

  const availableTransitions = ([
    "new",
    "in progress",
    "completed"
  ] as TaskStatusEnum[]).filter(transition => task.status !== transition);

  return (
    <DropdownMenu
      ref={dropdownRef}
      toggle={
        <TaskStatusButton onClick={() => setOpen(open => !open)}>
          <TaskStatus status={task.status} />
        </TaskStatusButton>
      }
      open={open}
    >
      {availableTransitions.map(transition => (
        <TaskStatusButton onClick={() => setOpen(false)}>
          <TaskStatus status={transition} />
        </TaskStatusButton>
      ))}
    </DropdownMenu>
  );
};

const TaskItem: React.FunctionComponent<{
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

export default TaskItem;
