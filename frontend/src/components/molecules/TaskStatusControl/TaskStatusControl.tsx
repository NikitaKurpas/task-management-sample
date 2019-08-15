import React, { useRef, useState } from "react";
import {
  ITask,
  TaskStatus as TaskStatusEnum
} from "../../../../../common/types/common";
import DropdownMenu, {
  useDismissibleDropdown
} from "../DropdownMenu/DropdownMenu";
import TaskStatus from "../../atoms/TaskStatus/TaskStatus";
import { TaskStatusButton } from "../../organisms/Task/Task.styled";
import { preventPropagation } from '../../../utils/preventPropagation'

export const TaskStatusControl: React.FunctionComponent<{ task: ITask }> = ({
  task
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useDismissibleDropdown(dropdownRef, open, setOpen);

  if (task.status === "archived") {
    return <TaskStatus status={task.status} />;
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
        <TaskStatusButton onClick={preventPropagation(() => setOpen(open => !open))}>
          <TaskStatus status={task.status} />
        </TaskStatusButton>
      }
      open={open}
    >
      {availableTransitions.map(transition => (
        <TaskStatusButton key={transition} onClick={preventPropagation(() => setOpen(false))}>
          <TaskStatus status={transition} />
        </TaskStatusButton>
      ))}
    </DropdownMenu>
  );
};
