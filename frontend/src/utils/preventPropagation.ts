import { EventHandler, SyntheticEvent } from "react";

export const preventPropagation = <E extends SyntheticEvent<any>>(
  handler: EventHandler<E>
) => (e: E) => {
  e.stopPropagation();
  return handler(e);
};
