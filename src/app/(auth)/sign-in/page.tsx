import { SignIn } from '@clerk/nextjs/app-beta'

export default function Page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <SignIn signUpUrl="/sign-up" redirectUrl={'/'} />
    </div>
  )
}
