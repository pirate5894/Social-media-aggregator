"use client";
import "@/app/globals.css";
import axios from "axios";
import facebookIcon from "../icons/facebook.png";
import Header from "../header/header";
import { generateAvator,formatDateTime,getName } from "../utils/utils";
import React, { useState, useEffect } from "react";

import Link from "next/link";

export default function MessagesList() {
  const [pages, setPages] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/facebook/pages/conversations")
      .then((response) => {
        setPages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });   
  
  }, []);

  // const sortedConversations = conversations.sort((a, b) => {
  //   return b.data[0].created_time - a.data[0].created_time;
  // });
  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-white ">
    <Header/>
    <div className="mt-24 flex flex-col divide-y">
      {pages?.map((page: any) => (
        page.conversation?.map((conversation: any) => (
        <Link href={{ pathname: "/chats", query: { conversationData: JSON.stringify({
          conversationId:conversation.conversationId, pageId:page.pageId, pageToken: page.pageToken}) }  }}   key={conversation?.messagesList?.data[0]?.id}>
        <div
          className="flex flex-row items-center w-screen pb-4 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={generateAvator(
              getName(
                conversation?.messagesList?.data[0]?.to?.data[0].name,
                conversation?.messagesList?.data[0]?.from?.name
              )
            )}
            className="w-14 h-14 mt-6 rounded-full m-2"
            alt=""
          />
          <div className="flex flex-col flex-grow w-full">
            <div className="flex items-center space-x-2 mt-2 w-full">
              <img
                src={facebookIcon.src}
                className="w-6 h-6 rounded"
                alt="social"
              />
              <p className="font-medium">
                {getName(
                  conversation?.messagesList?.data[0]?.to?.data[0].name,
                  conversation?.messagesList?.data[0]?.from?.name
                )}
              </p>
            </div>
            <p className="truncate text-sm text-gray-700 mt-4 w-56">
              {conversation?.messagesList?.data[0]?.message}
            </p>
          </div>
          <div className="flex flex-col items-end mt-4 me-2 w-24">
            <p className="text-xs text-gray-700">
              {formatDateTime(conversation?.messagesList?.data[0]?.created_time)}
            </p>
            <div className="flex justify-center items-center h-5 w-5 bg-gray-200 text-gray-500 rounded-lg mt-4">
              <p className="text-sm">{conversation?.messagesList?.data?.length}</p>
            </div>
          </div>
        </div>
        </Link>
      ))
    ))}
    </div>
    </div>
  );
}
