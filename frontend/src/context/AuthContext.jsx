import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api, { clearAuthTokens, onUnauthorized, setAuthTokens } from '../services/api';

export const AuthContext = createContext({
  user: null,
  tokens: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {}
});

const STORAGE_KEY = 'trading_journal_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setTokens(parsed.tokens);
      if (parsed.tokens) {
        setAuthTokens(parsed.tokens);
      }
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((nextUser, nextTokens) => {
    setUser(nextUser);
    setTokens(nextTokens);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: nextUser, tokens: nextTokens })
      );
    }
    if (nextTokens) {
      setAuthTokens(nextTokens);
    } else {
      clearAuthTokens();
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      const nextTokens = { access: data.accessToken, refresh: data.refreshToken };
      persist(data.user, nextTokens);
      return data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      const nextTokens = { access: data.accessToken, refresh: data.refreshToken };
      persist(data.user, nextTokens);
      return data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [persist]);

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      logout();
    });
    return unsubscribe;
  }, [logout]);

  const updateUser = useCallback(
    (nextUser) => {
      if (!tokens) {
        setUser(nextUser);
        return;
      }
      persist(nextUser, tokens);
    },
    [persist, tokens]
  );

  const value = useMemo(
    () => ({
      user,
      tokens,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }),
    [user, tokens, isLoading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
