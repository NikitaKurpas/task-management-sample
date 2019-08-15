import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { IJwtTokenPayload, IUser } from "../../../../common/types/common";
import { useApiRead } from "../API/APIReadRequest";
import Router from "next/router";
import jwtDecode from 'jwt-decode';

type Auth = {
  loading: boolean;
  user: IUser | null;
  token: string | null;
  tokenUser: IJwtTokenPayload | null;
  initAuth: (token: string) => any;
  logout: () => any;
};

const AuthContext = createContext<Auth>({
  loading: false,
  user: null,
  token: null,
  tokenUser: null,
  initAuth: () => {},
  logout: () => {}
});

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenUser, setTokenUser] = useState<IJwtTokenPayload | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const { data, loading, error, refetch } = useApiRead<IUser>("/users/me", {
    fetchProtectedOnly: true
  });

  useEffect(() => {
    const token = localStorage.getItem("_t")
    if (!token) return
    setToken(token)
    setTokenUser(jwtDecode(token))
  }, []); // Get token in browser only

  if (!user && !loading && !error && data) {
    setUser(data);
  }

  const value = useMemo<Auth>(
    () => ({
      loading,
      user,
      token,
      tokenUser: tokenUser,
      initAuth: async (token: string) => {
        localStorage.setItem("_t", token);
        setToken(token)
        setTokenUser(jwtDecode(token))
        setUser(null);
        await refetch();
      },
      logout: async () => {
        localStorage.removeItem("_t");
        setToken(null);
        setTokenUser(null)
        setUser(null);
        await Router.push("/login");
      }
    }),
    [loading, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): Auth => useContext(AuthContext);
