import React, { Reducer, useReducer, useCallback } from "react";
import { HTTPMethod, useApiClient } from "./APIClient";
import { handleInvalidResponse } from "./APIClient.utils";

type APIWriteOptions = {
  method?: HTTPMethod;
  headers?: HeadersInit;
  // Option specifies whether to short-circuit when token is not available on protected resources
  fetchProtectedOnly?: boolean;
};

type APIWriteResult<T, U extends {}> = [
  (body: U) => void,
  {
    data?: T;
    loading: boolean;
    error?: Error;
  }
];

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

export const useApiWrite = <T extends any, U extends {}>(
  path: string,
  { method = "POST", headers: initHeaders, fetchProtectedOnly = false }: APIWriteOptions = {}
): APIWriteResult<T, U> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, {
    loading: false
  });
  const client = useApiClient();

  const token = localStorage.getItem("_t");

  // Short-circuit when the token is not available
  if (fetchProtectedOnly && !token) {
    dispatch({ type: 'error', payload: new Error('Unable to perform operation. Reason: unauthenticated.') })
  }

  const headers = new Headers(initHeaders)
  headers.append('Content-Type', 'application/json')

  const executor = useCallback(
    async (body: U) => {
      try {
        dispatch({ type: "loading" });

        const res = await client.execute(path, {
          method,
          headers,
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          return await handleInvalidResponse(res, dispatch);
        }

        const data = (await res.json()) as T;

        dispatch({ type: "data", payload: data });
      } catch (err) {
        dispatch({ type: "error", payload: err });
      }
    },
    [path, method, headers]
  );

  return [executor, state];
};
