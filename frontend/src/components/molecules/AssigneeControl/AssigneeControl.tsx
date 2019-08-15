import React, { useRef, useState } from "react";
import { IUser } from "../../../../../common/types/common";
import DropdownMenu, {
  useDismissibleDropdown
} from "../DropdownMenu/DropdownMenu";
import { DeleteButton, UserAvatar } from "../../organisms/Task/Task.styled";

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
        <UserAvatar
          email={assignee.email}
          title={assignee.name || assignee.email}
          size={80}
          tabIndex={0}
          onClick={() => setOpen(open => !open)}
        />
      }
      open={open}
    >
      <DeleteButton
        title={`Remove ${assignee.name || assignee.email} from this task`}
        onClick={() => setOpen(false)}
      />
    </DropdownMenu>
  );
};
