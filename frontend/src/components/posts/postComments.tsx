"use client";
import "@/app/globals.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { formatTimeAgo } from "./posts-function";
import { generateAvator } from "../utils/utils";

const Comments = ({ postId, pageToken }:any) => {
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const startofCommentsRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/facebook/pages/post/comments",
        {
          postId: postId,
          pageToken: pageToken,
        }
      );
      console.log(response.data)
      const sortedComments = response.data?.data;
      sortedComments.sort((a:any,b:any )=> b.created_time - a.created_time).reverse();
      setCommentsList(sortedComments);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleSendComment = async () => {
    const axiosInstance = axios.create({
       baseURL: "http://localhost:3000",
       headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "POST",
         "Access-Control-Allow-Headers": "Content-Type",
       },
     });
       const newComment = {
        postId,
        pageToken,
        message:comment,
       };
       setComment('');
       try {
         await axiosInstance.post("/facebook/pages/post/comment/add", newComment);
         await fetchComments();
         startofCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
       } catch (error) {
         console.error(error);
       }
   };

  useEffect(() => {

    fetchComments();
  }, [postId, pageToken]);

  return (
    <div className="py-4 h-48">
     <div ref={startofCommentsRef}></div>
      {commentsList.map((comment) => (
        <div key={comment?.id} className="flex mt-2 mb-2">
          <img
            src={generateAvator(comment?.from?.name)}
            className="w-10 h-10 ms-2 rounded-full"
            alt=""
          />
          <div className="flex flex-col">
            <div className="flex flex-col mx-2 mt-2   min-w-[5rem] w-full rounded-lg px-3 py-1 shadow-md bg-blue-200">
              <p className="text-sm font-medium text-nowrap">{comment?.from?.name}</p>
              <p className="text-sm font-light ">{comment?.message}</p>
            </div>
            <div className="flex mt-auto text-slate-500 text-sm ms-2">
            <p className="me-2">
              {formatTimeAgo(comment?.created_time)}
            </p>
             <p className="ms-2 hover:text-blue-600">reply</p>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-row  items-center w-full h-16 px-2 sticky bottom-0 z-10 overflow-hidden bg-white">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendComment();
            }
          }}
          type="text"
          className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Type a comment..."
        />
        <div
          className="p-2  rounded bg-blue-500"
          onClick={handleSendComment}
        >
          <p className="text-white">Send</p>
        </div>
      </div>
    </div>
  );
};

export default Comments;

