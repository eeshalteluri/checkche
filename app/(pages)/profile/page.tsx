"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const ProfilePage = () => {
  return (
    <div>
      ProfilePage
      <Button onClick={() => signOut({redirectTo: "/"})}>Log out</Button>
    </div>
  )
}

export default ProfilePage