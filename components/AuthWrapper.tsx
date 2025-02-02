import Link from "next/link";
import { GradientBackground } from "@/app/components/GradientBackground";
import Logo from "./Logo";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center ">
      <GradientBackground />
      <div className="w-full max-w-sm space-y-8 relative z-10 animate-fade-in-up">
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" title="Home" className="block w-fit mx-auto">
              <Logo />
            </Link>
          </div>
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
