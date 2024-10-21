import { createContext, ReactNode, useEffect, useState } from "react";
import { User, PromiseResponse } from "../types";
import { account } from "../utils/appwrite";
import { createRootFolder } from "../utils/db";
import { defaultRootFolder } from "../utils/constants";

interface UserContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<PromiseResponse<null>>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<PromiseResponse<null>>;
  logout: () => Promise<PromiseResponse<null>>;
  loading: boolean;
}

export const AuthContext = createContext<UserContextProps | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (
    email: string,
    password: string
  ): Promise<PromiseResponse<null>> => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();

      setUser({
        id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
      });
      return { error: false, data: null };
    } catch (error: unknown) {
      console.log(">>> login error", error);
      if (error instanceof Error) {
        return { error: true, message: error.message };
      }
      return { error: true, message: "unknown error occured" };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<PromiseResponse<null>> => {
    try {
      const user = await account.create("unique()", email, password, name);

      await login(email, password);

      await createRootFolder({ ...defaultRootFolder, user_id: user.$id });

      return { error: false, data: null };
    } catch (error: unknown) {
      console.log(">>> ses error", error);
      if (error instanceof Error) {
        return { error: true, message: error.message };
      }
      return { error: true, message: "unknown error occured" };
    }
  };

  const logout = async (): Promise<PromiseResponse<null>> => {
    try {
      await account.deleteSession("current");
      setUser(null);
      return { error: false, data: null };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: true, message: error.message };
      }
      return { error: true, message: "unknown error occured" };
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
  );
};
