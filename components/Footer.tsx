import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

import { Button } from "./ui/button";


const Footer = () => {
  return (
    <div className='w-full p-4 fixed bottom-0 bg-black flex justify-around items-center'>
        <AiOutlineHome className="text-white cursor-pointer text-2xl"/>
        <Button className="bg-white text-black text-xl hover:bg-slate-300">+</Button>
        <FaRegUser className="text-white cursor-pointer text-2xl"/>
    </div>
  )
}

export default Footer