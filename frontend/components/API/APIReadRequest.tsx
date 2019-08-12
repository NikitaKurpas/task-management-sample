import React, { Reducer, useEffect, useReducer } from "react";
import { HTTPMethod, useApiClient } from "./APIClient";
import { handleInvalidResponse } from "./APIClient.utils";

type APIReadOptions = {
  method?: HTTPMethod;
  headers?: HeadersInit;
};

type APIReadResult<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

type Action<T> =
  | { type: "loading" }
  | { type: "error"; payload: Error }
  | { type: "data"; payload: T };

type State<T> = {
  loading: boolean;
  error?: Error;
  data?: T;
};

const reducer = <T extends {}>(
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case "loading":
      return { loading: true };
    case "error":
      return { loading: false, error: action.payload };
    case "data":
      return { loading: false, data: action.payload };
  }
};

export const useApiRead = <T extends {}>(
  path: string,
  { method = "GET", headers }: APIReadOptions = {}
): APIReadResult<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, {
    loading: true
  });
  const client = useApiClient();

  useEffect(
    () => {
      (async () => {
        try {
          dispatch({ type: "loading" });

          const res = await client.execute(path, {
            method,
            headers
          });

          if (!res.ok) {
            return await handleInvalidResponse(res, dispatch);
          }

          const data = (await res.json()) as T;

          dispatch({ type: "data", payload: data });
        } catch (err) {
          dispatch({ type: "error", payload: err });
        }
      })();
    },
    [path, method, headers]
  );

  return state;
};
