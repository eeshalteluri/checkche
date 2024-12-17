import { Button } from "@/components/ui/button"
import Link from "next/link"

const page = () => {
  return (
    <div className="h-full flex items-center justify-center gap-2 ">
      <Button 
        variant="ghost"
        asChild>
        <Link href="/signin">
          Sign In
        </Link>
      </Button> 
      <Button asChild>
        <Link href="/signup">
          Sign Up
        </Link>
      </Button> 
    </div>
  )
}

export default page