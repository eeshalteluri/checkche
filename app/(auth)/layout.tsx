import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/auth"

const SignInPage = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex justify-center items-center h-full">
      
      <form
      action={async () => {
        "use server"
        await signIn("google", {redirectTo: "/dashboard"})
      }}
    >
      <Button
      type="submit"
      >
        <FcGoogle/> Continue with Google
      </Button>
    </form>
    
      {children}
    </div>
  )
}

export default SignInPage