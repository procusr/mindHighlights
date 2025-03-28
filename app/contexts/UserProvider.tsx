"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-helpers-nextjs";
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

interface UserContextProps {
  isLoggedIn: boolean;
  user: User | undefined;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

async function initializeAuth() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    initializeAuth().then((user) => {
      setIsLoggedIn(user?.user !== null);
      setUser(user?.user);
    });
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const refreshAuthState = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};

export default UserProvider;
