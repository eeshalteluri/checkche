import Link from "next/link";
import { House, CircleUser, Users, Bell } from 'lucide-react';
import { HiUserGroup } from "react-icons/hi2";
import AddNewTask from "./AddNewTask";

const Footer = () => {
  return (
    <div className='w-full p-4 fixed bottom-0 bg-black flex justify-around items-center'>
        <Link 
          href="/dashboard"
        >
          <House className="text-white cursor-pointer text-2xl"/>
        </Link>
        
        <Link 
          href="/groups"
        >
          <HiUserGroup className="text-white cursor-pointer text-2xl"/>
        </Link>

      
        <AddNewTask />
        
        <Link 
          href="/friends"
        >
          <Users 
            className="text-white cursor-pointer text-2xl"
          />
        </Link>
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