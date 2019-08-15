import React from "react";
import styled from "styled-components";
import { theme } from "../../../theme";

const Container = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.lightRed};
`;

const ErrorText = styled.p`
  color: ${theme.colors.red};
`;

const ErrorMessage: React.FunctionComponent<{ error: Error | string }> = ({
  error
}) => (
  <Container>
    <ErrorText>{typeof error === "string" ? error : error.message}</ErrorText>
  </Container>
);

export default ErrorMessage;
