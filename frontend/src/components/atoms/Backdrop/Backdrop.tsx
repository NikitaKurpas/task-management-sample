import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Backdrop = styled.div`
  background: #000;
  opacity: 0.3;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

export default ({ onClick }: { onClick?: (e: React.MouseEvent) => void }) =>
  ReactDOM.createPortal(<Backdrop onClick={onClick} />, document.body);
