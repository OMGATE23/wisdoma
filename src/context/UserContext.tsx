import { createContext, ReactNode, useEffect, useState } from "react";
import { User, UserLoginSignUpFormat } from "../types";
import { account } from '../utils/appwrite';

interface UserContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<UserLoginSignUpFormat>;
  signup: (email: string, password: string, name: string) => Promise<UserLoginSignUpFormat>;
  logout: () => Promise<UserLoginSignUpFormat>;
  loading: boolean
}

export const AuthContext = createContext<UserContextProps | null>(null);

export const AuthContextProvider = ({children} : {children: ReactNode}) : JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string): Promise<UserLoginSignUpFormat> => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();

      setUser({
        id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
      });
      return {error: false}
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {error: true, message: error.message}
      }
      return {error: true, message: "unknown error occured"}
    }
  };

  const signup = async (email: string, password: string, name: string) : Promise<UserLoginSignUpFormat> => {
    try {
      await account.create('unique()', email, password, name);
      await login(email, password);
      return {error: false}
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {error: true, message: error.message}
      }
      return {error: true, message: "unknown error occured"}
    }
  };

  const logout = async (): Promise<UserLoginSignUpFormat> => {
    try {
      await account.deleteSession('current');
      setUser(null);
      return {error: false}
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {error: true, message: error.message}
      }
      return {error: true, message: "unknown error occured"}
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await account.get();
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

