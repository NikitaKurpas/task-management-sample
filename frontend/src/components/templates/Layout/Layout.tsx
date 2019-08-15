import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 700px;
  margin: 40px auto;
`;

const Layout: React.FunctionComponent = ({ children }) => (
  <Container>{children}</Container>
);

export default Layout;
