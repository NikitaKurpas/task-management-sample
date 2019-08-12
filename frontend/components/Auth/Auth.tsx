import React, { createContext, useContext, useMemo, useState } from "react";
import { IUser } from "../../../common/types/common";
import { useApiRead } from '../API/APIReadRequest'
import Router from 'next/router'

type Auth = {
  loading: boolean
  user: IUser | null;
  token: string | null;
  initAuth: (token: string) => any
  logout: () => any
};

const AuthContext = createContext<Auth>({
  loading: false,
  user: null,
  token: null,
  initAuth: () => {},
  logout: () => {},
});

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  // const token = localStorage.getItem('_t')
  const [token, setToken] = useState<string | null>(localStorage.getItem("_t"))
  const [user, setUser] = useState<IUser | null>(null)
  const { data, loading, error, refetch } = useApiRead<IUser>('/users/me', { fetchProtectedOnly: true })

  if (!user && !loading && !error && data) {
    setUser(data)
  }

  const value = useMemo<Auth>(() => ({
    loading,
    user,
    token,
    initAuth: async (token: string) => {
      localStorage.setItem("_t", token);
      setToken(token)
      setUser(null)
      await refetch()
    },
    logout: async () => {
      localStorage.removeItem("_t");
      setToken(null)
      setUser(null)
      await Router.push('/login')
    }
  }), [loading, user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): Auth => useContext(AuthContext);
