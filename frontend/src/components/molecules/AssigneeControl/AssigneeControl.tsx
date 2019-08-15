import React, { useRef, useState } from "react";
import { IUser } from "../../../../../common/types/common";
import DropdownMenu, {
  useDismissibleDropdown
} from "../DropdownMenu/DropdownMenu";
import { DeleteButton, UserAvatar } from "../../organisms/Task/Task.styled";
import { preventPropagation } from "../../../utils/preventPropagation";
import styled from "styled-components";

const UserAvatarButton = styled.button`
  border: none;
  background: none;
  color: #000;
  margin: 0;
  padding: 0;
`;

export const AssigneeControl: React.FunctionComponent<{ assignee: IUser }> = ({
  assignee
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useDismissibleDropdown(dropdownRef, open, setOpen);

  return (
    <DropdownMenu
      ref={dropdownRef}
      toggle={
        <UserAvatarButton
          onClick={preventPropagation(() => setOpen(open => !open))}
        >
          <UserAvatar
            email={assignee.email}
            title={assignee.name || assignee.email}
            size={80}
          />
        </UserAvatarButton>
      }
      open={open}
    >
      <DeleteButton
        title={`Remove ${assignee.name || assignee.email} from this task`}
        onClick={preventPropagation(() => setOpen(false))}
      />
    </DropdownMenu>
  );
};
