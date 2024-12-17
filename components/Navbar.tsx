import Link from "next/link"
import Image from "next/image"

import { Search, Bell } from 'lucide-react';


const Navbar = () => {
  return (
    <div className="p-4 border-b-2 flex justify-between items-center">
      <Link href="/">
        <Image 
        src="/logo.png"
        width={40}
        height={40}
        alt="Logo"
        />
      </Link>

      <div className="flex gap-4">
        <Search className="w-[25px] h-[25px]"/>
        <Link href="/notifications">
        <Bell className="w-[25px] h-[25px]"/>
        </Link>
      </div>

    </div>
  )
}

export default Navbar