import styled from "styled-components";
import AdorableAvatar from "../../atoms/Avatar/AdorableAvatar";
import IconButton from "../../atoms/IconButton/IconButton";
import { theme } from "../../../theme";
import { darken } from "polished";

export const UserAvatar = styled(AdorableAvatar)`
  height: 40px;
  width: 40px;
  margin-right: 20px;
  flex-shrink: 0;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;

export const Text = styled.p`
  margin: 0;
  display: inline-block;
  word-break: break-word;
  font-size: 12px;
`;

export const DeleteButton = styled(IconButton).attrs({ name: "delete" })<
  Omit<typeof IconButton, "name">
>`
  background: transparent;
  color: ${theme.colors.red};
  margin-left: auto;

  &:hover {
    background: ${darken(0.1, theme.colors.lightRed)};
  }
`;
