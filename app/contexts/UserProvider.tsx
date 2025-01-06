// "use client";

// import { createClient } from "@/utils/supabase/client";
// import { createContext, useContext, type ReactNode } from "react";

// interface UserContextProps {
//   isLoggedIn: boolean;
// }

// export const UserContext = createContext<UserContextProps | undefined>(
//   undefined
// );

// const initializeAuth = () => {
//   const supabase = createClient();
//   supabase.auth.getUser().then(({ data: { user } }) => {
//     currentLoginState = !!user;
//   });
//   return false;
// };

// let currentLoginState = initializeAuth();

// const UserProvider = ({ children }: { children: ReactNode }) => {
//   return (
//     <UserContext value={{ isLoggedIn: currentLoginState }}>
//       {children}
//     </UserContext>
//   );
// };

// export const useUser = (): UserContextProps => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

// export default UserProvider;

// export const refreshAuthState = async () => {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   currentLoginState = !!user;
//   return currentLoginState;
// };
