import Link from "next/link";
import { Button } from "./ui/button";
import { House, CircleUser } from 'lucide-react';



const Footer = () => {
  return (
    <div className='w-full p-4 fixed bottom-0 bg-black flex justify-around items-center'>
        <Link 
          href="/dashboard"
        >
          <House className="text-white cursor-pointer text-2xl"/>
        </Link>

        <Button 
          className="bg-white text-black text-xl hover:bg-slate-300"
        >
          +
        </Button>
        
        <Link 
          href="/profile"
        >
          <CircleUser 
            className="text-white cursor-pointer text-2xl"
          />
        </Link>
    </div>
  )
}

export default Footer