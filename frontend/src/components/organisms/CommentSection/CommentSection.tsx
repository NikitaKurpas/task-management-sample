import * as React from "react";
import { IComment } from "../../../../../common/types/common";
import Comment from "../../molecules/Comment/Comment";
import {
  CommentInput,
  Container,
  ScrollWrapper
} from "./CommentSection.styled";

const CommentSection: React.FunctionComponent<{ comments: IComment[] }> = ({
  comments
}) => (
  <Container>
    <ScrollWrapper>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ScrollWrapper>
    <CommentInput type="text" />
  </Container>
);

export default CommentSection;
