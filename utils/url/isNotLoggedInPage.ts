import { notLoggedinPages } from "@/app/constants/constants";
import { usePathname } from "next/navigation";

export const isNotLoggedInPage = () => {
  const pathname = usePathname();
  return notLoggedinPages.includes(pathname);
};
