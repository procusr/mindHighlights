import Link from "next/link"
import Logo from "./Logo"

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full max-w-sm rounded-md bg-white shadow-md ring-1 ring-black/5 mt-10">
      <div className="flex items-start text-lg font-semibold p-7 sm:p-7 ">
        <Link href="/" title="Home">
          <Logo />
        </Link>
      </div>
      <form action="#" method="POST" className="px-7 pt-7">
        {children}
      </form>
    </div>
  )
}
