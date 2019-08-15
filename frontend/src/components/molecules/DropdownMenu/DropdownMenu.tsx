import React, {
  PropsWithChildren,
  useEffect
} from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  height: 100%;
`;

const DropdownContainer = styled.div.attrs<{ open: boolean }>(({ open }) => ({
  style: {
    display: open ? "block" : "none"
  }
}))<{ open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
`;

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    open: boolean;
    toggle: React.ReactElement;
    className?: string;
  }>
>(({ open, toggle, className, children }, ref) => (
  <Wrapper className={className} ref={ref}>
    {toggle}
    <DropdownContainer open={open}>{children}</DropdownContainer>
  </Wrapper>
));

/**
 * Reusable hook that attaches an event listener to the document when the dropdown is open, so that when the user clicks
 * outside the dropdown - it will close it and remove the listener
 * @param ref Ref to the DropdownMenu wrapper node (the "ref" attribute)
 * @param open Flag that indicates whether the menu is open or not
 * @param setOpen A function that sets the open flag
 */
export const useDismissibleDropdown = (ref: React.RefObject<HTMLElement>, open: boolean, setOpen: (open: boolean) => any) => {
  useEffect(() => {
    if (!open) return

    let listener = (event: DocumentEventMap['click']) => {
      if (!ref.current) return

      if (!ref.current.contains(event.target as HTMLElement)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', listener)
    return () => document.removeEventListener('click', listener)
  }, [open])
}

export default DropdownMenu;
