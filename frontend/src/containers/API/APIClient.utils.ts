import Router from "next/router";
import { IErrorResponse } from "../../../../common/types/common";

type Dispatch = (action: { type: "error"; payload: Error }) => any;

export const handleInvalidResponse = async (
  res: Response,
  dispatch: Dispatch
) => {
  // Token invalid or expired
  if (res.status === 401) {
    await Router.push("/");
    dispatch({
      type: "error",
      payload: new Error(
        "Unable to perform operation. Reason: unauthenticated."
      )
    });
  }

  // Requires admin
  if (res.status === 403) {
    dispatch({
      type: "error",
      payload: new Error(
        "Unable to perform operation. Reason: missing permissions."
      )
    });
  }

  try {
    const data = (await res.json()) as IErrorResponse;
    dispatch({
      type: "error",
      payload: new Error(data.message)
    });
  } catch (err) {
    dispatch({
      type: "error",
      payload: new Error(`${res.status} ${res.statusText}`)
    });
  }
};
