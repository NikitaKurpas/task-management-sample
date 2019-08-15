import React, { FormEvent, useCallback, useReducer } from "react";

type Action = {
  type: keyof State;
  payload: string;
};

type State = {
  email: string;
  password: string;
  name: string;
  error?: string;
};

const reducer = (state: State, action: Action): State => {
  return {
    ...state,
    [action.type]: action.payload
  };
};

const RegisterView: React.FunctionComponent<{
  onRegister: (email: string, password: string, name: string) => any;
  loading: boolean;
  error?: Error;
}> = ({ onRegister, error: networkError, loading }) => {
  const [{ email, password, name, error }, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    name: "",
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

      onRegister(email, name, password);
    },
    [onRegister]
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => dispatch({ type: "email", payload: e.target.value })}
      />
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        required
        value={name}
        onChange={e => dispatch({ type: "name", payload: e.target.value })}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        placeholder="Password"
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

export default RegisterView
