import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UsernameForm from "../../components/UsernameForm"
  

const ClaimUsername = () => {
  return (
    <div className="max-w-2xl m-2 p-4 bg-red-100 rounded flex justify-between items-center gap-4">
        <p>Add <span className="bold">username</span> to be discovered by your friends.</p>
        
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-red-500 text-white">Claim Username</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Claim Username</DialogTitle>
                    
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Username
                            </Label>
                            <Input id="username" placeholder="@michaeljackson" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit" className="bg-red-500 text-white">Claim</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

    </div>
  )
}

export default ClaimUsername