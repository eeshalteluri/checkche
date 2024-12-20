"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form" 
import { Separator } from "@/components/ui/separator"

const ProfilePage = () => {
  const form  = useForm()

  return (
    <Card className="w-[350px] mt-4 mx-auto">
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2 ">
              <Input id="fullName" value="Eeshal Teluri" placeholder="Eeshal Teluri" />
              <Button>Change Name</Button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <div className="flex gap-2 ">
              <Input id="userName" value="eeshalteluri" placeholder="@eeshalteluri" />
              <Button>Change Username</Button>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2 ">
              <Input id="email" value="email@example.com" placeholder="email@example.com" disabled={true} readOnly/>

              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p>Looking to Log Out?</p>
        <Button onClick={async ()=>{ await signOut({redirectTo: "/"})}}>Log Out</Button>
      </CardFooter>
    </Card>
  )
}

export default ProfilePage