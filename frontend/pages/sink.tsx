import React from "react";
import TaskStatus from "../src/components/atoms/TaskStatus/TaskStatus";
import Task from "../src/components/organisms/Task/Task";
import styled from "styled-components";
import { ITask, IUser } from '../../common/types/common'
import ErrorMessage from '../src/components/atoms/ErrorMessage/ErrorMessage'
import Loader from '../src/components/atoms/Loader/Loader'

const SectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const user1: IUser = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'user',
  createdAt: new Date(),
}

const user2: IUser = {
  id: '2',
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
  role: 'user',
  createdAt: new Date(),
}

const task: ITask = {
  id: '1',
  description: "Lorem ipsum dolor sit amet",
  status: "in progress",
  assignees: [user1],
  comments: [],
  createdAt: new Date(),
  createdBy: user1,
  updatedAt: new Date(),
}

const TaskItemWrapper = styled(Task)`
  margin-bottom: 20px;
`

const ComponentSinkPage = () => (
  <div>
    <SectionContainer>
      <TaskStatus status={"new"} />
      <TaskStatus status={"in progress"} />
      <TaskStatus status={"completed"} />
      <TaskStatus status={"archived"} />
    </SectionContainer>

    <SectionContainer style={{ flexDirection: 'column' }}>
      <TaskItemWrapper task={task}/>
      <TaskItemWrapper task={{ ...task, status: 'new', assignees: [user1, user2], createdBy: user2 }}/>
      <TaskItemWrapper task={{ ...task, status: 'completed', assignees: [], description: 'Cum abaculus ridetis, omnes gemnaes desiderium lotus, ferox vigiles. Accelerare interdum ducunt ad regius nuclear vexatum iacere.' }}/>
      <TaskItemWrapper task={{ ...task, status: 'archived', assignees: [], description: 'Ubi est emeritis tata?' }}/>
    </SectionContainer>

    <SectionContainer style={{ flexDirection: 'column' }}>
      <ErrorMessage error={'Resurrection is the only reincarnation, the only guarantee of surrender.'} />
    </SectionContainer>

    <SectionContainer style={{ flexDirection: 'column' }}>
      <Loader />
    </SectionContainer>
  </div>
);

export default ComponentSinkPage;
