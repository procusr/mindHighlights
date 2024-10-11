import { GradientBackground } from "../components/GradientBackground"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <GradientBackground />
      {children}
    </div>
  )
}
