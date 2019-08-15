import React from "react";
import styled from "styled-components";
import Icon from "../Icon/Icon";
import { darken } from 'polished'

export const Button = styled.button`
  // remove styles
  border: none;
  background: none;
  color: #000;
  margin: 0;

  width: 40px;
  height: 40px;
  padding: 8px;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${darken(0.1, '#fff')};
  }
`;

const IconButton: React.FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string;
  size?: number;
}> = ({ name, size, ...rest }) => (
  <Button {...rest}>
    <Icon name={name} size={size} />
  </Button>
);

export default IconButton
