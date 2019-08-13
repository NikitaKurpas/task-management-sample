import React from "react";
import { TaskStatus as TaskStatusEnum } from "../../../common/types/common";
import capitalize from "../../utils/capitalize";
import styled from "styled-components";
import { theme } from '../theme'

const stateToColor: {
  background: Record<TaskStatusEnum, string>;
  text: Record<TaskStatusEnum, string>;
} = {
  background: {
    new: theme.colors.lightGray,
    "in progress": theme.colors.lightBlue,
    completed: theme.colors.lightGreen,
    archived: theme.colors.pink
  },
  text: {
    new: theme.colors.gray,
    "in progress": theme.colors.blue,
    completed: theme.colors.green,
    archived: theme.colors.darkPink
  }
};

const Container = styled.div`
  width: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const Text = styled.span`
  font-size: 12px;
`;

const TaskStatus: React.FunctionComponent<{
  status: TaskStatusEnum;
  className?: string;
}> = ({ status, className }) => (
  <Container
    style={{ background: stateToColor.background[status] }}
    className={className}
  >
    <Text style={{ color: stateToColor.text[status] }}>
      {capitalize(status)}
    </Text>
  </Container>
);

export default TaskStatus;
