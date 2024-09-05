"use client";
import "@/app/globals.css";
import axios from "axios";
import { useState } from "react";

 
export default function ReplyComments() {
    const[replyComments,setReplyComments]=useState<any[]>([])
    const fetchReplyComments = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/facebook/pages/post/comment/reply",
            {
            //   postId: postId,
            //   pageToken: pageToken,
            }
          );
          console.log(response.data)
          const sortedComments = response.data?.data;
          sortedComments.sort((a:any,b:any )=> b.created_time - a.created_time);
          setReplyComments(sortedComments);
        } catch (error) {
          console.error("Error fetching comments", error);
        }
      };
  return (
   <div className="">
   
   </div>
  );
}
