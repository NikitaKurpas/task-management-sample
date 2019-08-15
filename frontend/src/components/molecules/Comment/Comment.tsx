import * as React from "react";
import { IComment } from "../../../../../common/types/common";
import { Container, DeleteButton, Text, UserAvatar } from "./Comment.styled";

const Comment: React.FunctionComponent<{ comment: IComment }> = ({
  comment
}) => (
  <Container>
    <UserAvatar email={comment.createdBy.email} />
    <Text>{comment.text}</Text>
    <DeleteButton />
  </Container>
);

export default Comment;
