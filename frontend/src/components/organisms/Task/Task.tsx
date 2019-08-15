import React, { useState } from "react";
import { ITask } from "../../../../../common/types/common";
import {
  ArchiveButton,
  CommentContainer,
  Container,
  Separator,
  Text,
  Wrapper
} from "./Task.styled";
import { useAuth } from "../../../containers/Auth/Auth";
import IconButton from "../../atoms/IconButton/IconButton";
import { AssigneeControl } from "../../molecules/AssigneeControl/AssigneeControl";
import { TaskStatusControl } from "../../molecules/TaskStatusControl/TaskStatusControl";
import Backdrop from "../../atoms/Backdrop/Backdrop";
import { preventPropagation } from "../../../utils/preventPropagation";
import CommentSection from "../CommentSection/CommentSection";

const Task: React.FunctionComponent<{
  task: ITask;
  className?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}> = ({ task, className, as }) => {
  const [expanded, setExpanded] = useState(false);
  const { tokenUser } = useAuth();
  const isAdmin = tokenUser ? tokenUser.admin : false;
  const displayedAssignees =
    task.assignees.length < 3 ? task.assignees : task.assignees.slice(0, 2);
  const hiddenAssignees =
    task.assignees.length < 3 ? [] : task.assignees.slice(2);

  return (
    <Container className={className} expanded={expanded} as={as}>
      <Wrapper
        tabIndex={0}
        onClick={preventPropagation(() => setExpanded(expanded => !expanded))}
      >
        <TaskStatusControl task={task} />
        <Text>{task.description}</Text>
        <Separator />
        <IconButton
          name="add"
          title="Add assignee to this task"
          onClick={preventPropagation(() => {})}
        />
        {displayedAssignees.map(assignee => (
          <AssigneeControl key={assignee.id} assignee={assignee} />
        ))}
        <ArchiveButton
          title="Archive this task"
          onClick={preventPropagation(() => {})}
        />
      </Wrapper>

      {expanded && (
        <CommentContainer>
          <CommentSection comments={task.comments || []} />
        </CommentContainer>
      )}
      {expanded && (
        <Backdrop onClick={preventPropagation(() => setExpanded(false))} />
      )}
    </Container>
  );
};

export default Task;
