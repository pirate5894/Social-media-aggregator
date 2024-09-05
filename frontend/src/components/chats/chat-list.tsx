import "@/app/globals.css";
import LeftArrrow from "../icons/app-icons/left-arrow1.png";
import SendButton from "../icons/app-icons/select.png";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  formatDateTime,
  generateAvator,
  getName,
  getPsId,
} from "../utils/utils";

export default function ChatsList() {
  const router = useRouter();
  const [conversation, setConversation] = useState<any>(null);
  const [messagesData, setMessagesData] =useState<any>(null);
  const [message, setMessage] = useState("");
  const [psId, setPsId] = useState("");
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const fetchInitialData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/facebook/pages/conversations",
        {
          conversationId: conversation?.conversationId,
          pageToken: conversation?.pageToken,
        }
      );
       const sortedConversation = response.data?.data
    ?.sort((a: any, b: any) => b.created_time - a.created_time)
    .reverse();
      setMessagesData(sortedConversation)
      setPsId(getPsId(response.data?.data?.[0]?.to?.data[0], response.data?.data?.[0]?.from));
    } catch (error) {
      console.error("Error in initial API call", error);
    }
  };

  useEffect(() => {
    if (router.query.conversationData) {
      const conversationData = JSON.parse(
        router.query.conversationData as string
      );

      setConversation(conversationData);
    }
  }, [router.query.conversationData]);


  useEffect(() => {
    if (conversation) {
      fetchInitialData();
    }
  }, [conversation]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  const handleSendMessage = async () => {
   const axiosInstance = axios.create({
      baseURL: "http://localhost:3000",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
    if (message.trim() !== "") {
      const newMessage = {
        message: message,
        pageToken: conversation?.pageToken,
        pageId: conversation?.pageId,
        psid: psId,
      };
      setMessage('');
      try {
        await axiosInstance.post("/facebook/pages/message", newMessage);
        await fetchInitialData();
      } catch (error) {
        console.error(error);
      }
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <div className="flex flex-row items-center fixed top-0 w-full h-24 bg-blue-500  shadow-md">
        <Link href="/messages">
          <img src={LeftArrrow.src} className="w-8 ms-2 h-8 " />
        </Link>
        <img
          src={generateAvator(
            getName(
              messagesData?.[0]?.to?.data[0].name,
              messagesData?.[0]?.from?.name
            )
          )}
          className="w-14 h-14 ms-2 rounded-full "
          alt=""
        />
        <p className=" text-white text-xl font-medium ms-1">
          {getName(
            messagesData?.[0]?.to?.data[0].name,
            messagesData?.[0]?.from?.name
          )}
        </p>
      </div>

      <div className="pt-28 pb-20 min-h-screen bg-gray-100">
        {messagesData?.map((message: any) => (
          <div
            key={message?.id}
            className={`flex mx-2 mt-2 w-fit max-w-[80%] rounded-lg px-3 py-1  shadow-md ${
              message?.from?.name === "Dev tools"
                ? "bg-blue-300 ms-auto"
                : "bg-white"
            }`}
          >
            <p className="text-base font-medium text-xl text-ellipsis overflow-hidden">
              {message?.message}
            </p>
            <p className="mt-auto text-slate-500 text-sm ms-2">
              {formatDateTime(message?.created_time)}
            </p>
          </div>
        ))}
         <div ref={endOfMessagesRef}></div>
      </div>
      <div className="flex flex-row items-center fixed bottom-0 w-full h-16 bg-white  shadow-md">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          type="text"
          className="w-full ms-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Type a message..."
        />
        <div
          className="p-2 mx-2 rounded-full bg-blue-500"
          onClick={handleSendMessage}
        >
          <img src={SendButton.src} className=" w-10 h-10" />
        </div>
      </div>
    </div>
  );
}
