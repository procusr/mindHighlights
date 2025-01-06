import { usePathname } from "next/navigation";

export const isNotLoggedInPage = () => {
  const pathname = usePathname();
  return ["/sign-in", "/sign-up", "/forgot-password", "/home"].includes(
    pathname
  );
};
