"use client";

import { createClient } from "@/utils/supabase/client";
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

interface UserContextProps {
  isLoggedIn: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

async function initializeAuth() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session !== null;
}

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    initializeAuth().then((loggedIn) => {
      setIsLoggedIn(loggedIn);
    });
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn }}>
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
