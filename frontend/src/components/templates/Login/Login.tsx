import React, { useCallback } from "react";
import { useApiWrite } from "../../../containers/API/APIWriteRequest";
import { ITokenResponse } from "../../../../../common/types/common";
import Router from "next/router";
import LoginView from "./LoginView";
import { useAuth } from '../../../containers/Auth/Auth'

const Login: React.FunctionComponent = () => {
  const [login, { data, loading, error: networkError }] = useApiWrite<
    ITokenResponse,
    { email: string; password: string }
  >("/auth/login");
  const handleLogin = useCallback(
    (email: string, password: string) => login({ email, password }),
    []
  );
  const { token, initAuth } = useAuth()

  // Redirect to index when token already exists
  if (token) {
    // noinspection JSIgnoredPromiseFromCall
    Router.push("/");
    return null;
  }

  let error = undefined;

  if (!networkError && !loading && data) {
    if (data.token) {
      initAuth(data.token)
      return null;
    }
    // Exceptional state, this shouldn't happen
    else {
      error = new Error("Invalid token in response from server.");
    }
  }

  return (
    <LoginView
      onLogin={handleLogin}
      loading={loading}
      error={networkError || error}
    />
  );
};

export default Login;
