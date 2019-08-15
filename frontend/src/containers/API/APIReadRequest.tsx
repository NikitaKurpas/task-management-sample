import React, { Reducer, useEffect, useReducer } from "react";
import { HTTPMethod, useApiClient } from "./APIClient";
import { handleInvalidResponse } from "./APIClient.utils";

type APIReadOptions = {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  // Option specifies whether to short-circuit when token is not available on protected resources
  fetchProtectedOnly?: boolean;
};

type APIReadResult<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
  refetch: () => Promise<any>;
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
  {
    method = "GET",
    headers = {},
    fetchProtectedOnly = false
  }: APIReadOptions = {}
): APIReadResult<T> => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, {
    loading: true
  });
  const client = useApiClient();

  const executeRequest = async () => {
    try {
      dispatch({ type: "loading" });

      const token = localStorage.getItem("_t");

      // Short-circuit when the token is not available
      if (fetchProtectedOnly && !token) {
        return dispatch({ type: 'error', payload: new Error('Unable to perform operation. Reason: unauthenticated.') })
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

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
  };

  useEffect(
    () => {
      // noinspection JSIgnoredPromiseFromCall
      executeRequest();
    },
    [path, method, headers]
  );

  return {
    ...state,
    refetch: executeRequest
  }
};
