import styled from "styled-components";
import AdorableAvatar from "../Avatar/AdorableAvatar";
import { padding } from "../../utils/css";
import IconButton from "../IconButton/IconButton";
import { theme } from "../theme";
import { darken } from 'polished'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 40px;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const Text = styled.p`
  ${padding(3, "h")};
  font-size: 12px;
  color: black;
  margin: 0;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Separator = styled.div`
  width: 0;
  margin-left: auto;
`;

export const UserAvatar = styled(AdorableAvatar)`
  height: 40px;
  width: 40px;
  filter: brightness(100%);
  transition: filter 0.2s ease-in-out;

  &:hover {
    filter: brightness(90%);
  }
`;

export const ArchiveButton = styled(IconButton).attrs({ name: "archive" })<Omit<typeof IconButton, 'name'>>`
  background: ${theme.colors.lightRed};
  color: ${theme.colors.red};
  
  &:hover {
    background: ${darken(0.1, theme.colors.lightRed)};
  }
`;

export const DeleteButton = styled(ArchiveButton).attrs({ name: 'delete' })``

export const TaskStatusButton = styled.button`
  border: none;
  background: none;
  color: #000;
  margin: 0;
  padding: 0;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #000;
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  }

  &:hover::after {
    opacity: 0.1;
  }
`
