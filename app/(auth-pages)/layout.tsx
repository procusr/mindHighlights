import { GradientBackground } from "../components/GradientBackground"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-12 items-center">
      <GradientBackground />
      {children}
    </div>
  )
}
