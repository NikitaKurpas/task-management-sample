import React, { FormEvent, useCallback, useReducer } from "react";

type Action = {
  type: keyof State;
  payload: string;
};

type State = {
  email: string;
  password: string;
  error?: string;
};

const reducer = (state: State, action: Action): State => {
  return {
    ...state,
    [action.type]: action.payload
  };
};

export const LoginView: React.FunctionComponent<{
  onLogin: (email: string, password: string) => any;
  loading: boolean;
  error?: Error;
}> = ({ onLogin, loading, error: networkError }) => {
  const [{ email, password, error }, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    error: networkError && networkError.message
  });

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!email || !email.includes("@")) {
        return dispatch({ type: "error", payload: "Incorrect email format" });
      }

      if (!password || password.length < 3) {
        return dispatch({ type: "error", payload: "Password is too short" });
      }

      onLogin(email, password);
    },
    [onLogin]
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={e => dispatch({ type: "email", payload: e.target.value })}
      />
      <input
        type="password"
        required
        minLength={3}
        value={password}
        onChange={e => dispatch({ type: "password", payload: e.target.value })}
      />
      <input type="submit" />
      {error && <p>{error}</p>}
    </form>
  );
};
