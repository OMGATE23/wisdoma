import { createContext, ReactNode, useEffect, useState } from "react";
import { User, PromiseResponse } from "../types";
import { account } from "../utils/appwrite";
import { createRootFolder } from "../utils/db";
import { defaultRootFolder } from "../utils/constants";
import { toast } from "sonner";
import { commonErrorHandling } from "../utils/helpers";

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
      const err = commonErrorHandling(error);
      toast.error(err.message);
      return err;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<PromiseResponse<null>> => {
    try {
      const user = await account.create("unique()", email, password, name);
      const root_folder = await createRootFolder({
        ...defaultRootFolder,
        user_id: user.$id,
      });
      console.log(">>> root folder");
      if (root_folder.error) {
        toast.error(root_folder.message);
        return {
          error: true,
          message: root_folder.message,
        };
      }
      await login(email, password);

      return { error: false, data: null };
    } catch (error: unknown) {
      const err = commonErrorHandling(error);
      toast.error(err.message);
      return err;
    }
  };

  const logout = async (): Promise<PromiseResponse<null>> => {
    try {
      await account.deleteSession("current");
      setUser(null);
      console.log('>>> loggin out')
      return { error: false, data: null };
    } catch (error: unknown) {
      const err = commonErrorHandling(error);
      toast.error(err.message);
      return err;
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
        toast.error("Couldn't load user, try again later");
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
