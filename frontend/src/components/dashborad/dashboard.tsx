"use client";
import "@/app/globals.css";
import facebookIcon from "../icons/facebook.png";
import AvatorIcon from "../icons/app-icons/avator.png";
import AppIcon from "../icons/social-media.png";
import Chat from"../icons/chat.png";
import Pages from '../icons/website.png'
import { useEffect, useState } from "react";
import { generateAvator } from "../utils/utils";
import axios from "axios";
import Link from "next/link";
 


export default function Dashboard() {
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
    <div className="flex flex-col min-h-screen bg-white ">
    <div className="flex flex-row items-center fixed top-0 w-full h-24 bg-blue-500  shadow-md">
    <p className="text-2xl ms-2 text-white font-semibold">Social Media Aggregator</p>
      <p className="text-white  text-sm ms-auto me-2">{name?.name}</p>
      <img
        src={generateAvator(name?.name)}
        className="w-14 h-14 me-2 rounded-full "
        alt=""
      />
    </div>
    <div className="flex flex-row h-54 justify-center rounded-md shadow-md mt-32 mx-10">
      <div className="flex flex-col align-center justify-center p-10 mt-8">
      <p className="text-2xl font-semibold mt-4">Hi {name?.name},</p>
      <p>Welcome to social media Aggregator</p>

      <div className=" mt-4 flex flex-col shadow-sm py-4 w-full  px-1">
      <div className="flex flex-row">
      <img src={facebookIcon.src} className="w-8 h-8 rounded"></img>
      <p className=" ms-1 text-xl font-semibold">Facebook</p>
      </div>
      <div className="flex flex-col w-full justify-center mt-5 ">
        <Link href='/messages'>
        <div className=" w-32 ms-10 mt-2 shadow-lg bg-gray-100  hover:bg-gray-200 rounded justify-center p-4">
          <img src={Chat.src} className="w-24 h-24"></img>
          <p className="justify-self-center w-full">Messages</p>
        </div>
        </Link>
        <Link href='/posts'>
        <div className="w-32  justify-center shadow-lg mt-10 ms-10 p-4 bg-gray-100 rounded hover:bg-gray-200">
        <img src={Pages.src} className="w-24 h-24"></img> 
        <p className="justify-self-center w-full">Posts</p>
        </div>
        </Link>
      </div>
      </div>
      </div>
    </div>
    </div>
   
  );
}
