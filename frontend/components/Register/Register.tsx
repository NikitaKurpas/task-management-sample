import React, { useCallback } from "react";
import { useApiWrite } from "../API/APIWriteRequest";
import RegisterView from "./RegisterView";
import Router from "next/router";
import { useAuth } from "../Auth/Auth";

const Register: React.FunctionComponent = () => {
  const [register, { loading, error }] = useApiWrite<
    void,
    {
      email: string;
      password: string;
      name: string;
    }
  >("/auth/register");
  const handleRegister = useCallback(
    (email, password, name) => register({ email, name, password }),
    []
  );

  const { token } = useAuth();

  // Redirect to index when token exists
  if (token) {
    // noinspection JSIgnoredPromiseFromCall
    Router.push("/");
    return null;
  }

  // Registration successful
  if (!loading && !error) {
    // noinspection JSIgnoredPromiseFromCall
    Router.push("/login");
    return null;
  }

  return (
    <RegisterView onRegister={handleRegister} loading={loading} error={error} />
  );
};

export default Register;
