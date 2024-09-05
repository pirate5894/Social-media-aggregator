"use client";
import "@/app/globals.css";
import axios from "axios";
import Link from "next/link";
import LeftArrrow from "../icons/app-icons/left-arrow1.png";
import { generateAvator} from "../utils/utils";
import { useEffect, useState } from "react";

export default function Header() {
    const [name, setName] = useState<any>();
    useEffect(() => {
        axios.get("http://localhost:3000/facebook/name")
        .then((response) => {
          setName(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
  
    }, []);
  return (
    <div className="flex flex-row items-center fixed top-0 w-full h-24 bg-blue-500  shadow-md">
    <Link href="/dashboard">
       <img src={LeftArrrow.src} className="w-8 ms-2 h-8 " />
     </Link>
   <p className="text-white  text-sm ms-auto me-2">{name?.name}</p>
   <img
     src={generateAvator(name?.name)}
     className="w-14 h-14 me-2 rounded-full "
     alt=""
   />
 </div>
  );
}
