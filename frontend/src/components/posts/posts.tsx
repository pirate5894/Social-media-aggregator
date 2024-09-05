"use client";
import "@/app/globals.css";
import Link from "next/link";
import DownArrow from "../icons/app-icons/down-arrow.png";
import Header from "../header/header";
import axios from "axios";
import { formatTimeAgo, getData } from "./posts-function";
import { useEffect, useState } from "react";
import PostModal from "./postModal";

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [openModalId, setOpenModalId] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/facebook/pages/posts")
      .then((response) => {
        console.log(response.data);
        setPosts(getData(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const openModal = (id: any) => {
    setOpenModalId(id);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };

  return (
    <div className="flex flex-col min-h-screen w-full  items-center bg-white ">
      <Header />
      <div className="mt-24 w-full my-4">
        {posts?.map((post: any) => (
          <div
            key={post?.attachments?.data[0]?.target?.id}
            className="mt-2 shadow-lg ms-2 me-2 rounded-md min-h-24 px-4 pt-6  divide-y"
          >
            <p className="mb-2 text-slate-500">
              posted {formatTimeAgo(post?.created_time)}
            </p>
            <div className="flex flex-col justify-center w-full">
              {post?.message && (
                <div
                  className={`right-0 w-full  overflow-hidden ${
                    post?.message?.length > 100 ? "h-24" : "h-12 mt-2"
                  }`}
                >
                  <p className="text-ellipsis line-clamp-2">
                    {post?.message || ""}
                  </p>
                  {post?.message?.length > 100 && (
                    <a
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() =>
                        openModal(post?.attachments?.data[0]?.target?.id)
                      }
                    >
                      Show more
                    </a>
                  )}
                </div>
              )}
              {post?.attachments?.data[0]?.media?.image && (
                <img
                  src={post.attachments.data[0].media.image.src}
                  className="w-[40rem] h-[28rem] self-center mt-2 border-2 border-gray-200 rounded"
                />
              )}
              {post?.attachments?.data[0]?.subattachments && (
                <div
                  className="w-full flex flex-col items-center hover:bg-blue-100"
                  onClick={() =>
                    openModal(post?.attachments?.data[0]?.target?.id)
                  }
                >
                  <h1>click for more</h1>
                  <img src={DownArrow.src} className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="mt-4 py-1 flex items-center justify-center hover:bg-blue-200 cursor-pointer">
              Comments
            </div>
            <PostModal
              isOpen={openModalId === post?.attachments?.data[0]?.target?.id}
              onClose={closeModal}
            >
              <div
                key={post?.attachments?.data[0]?.target?.id}
                className="mt-2  ms-2 me-2 rounded-md min-h-24 px-4 pt-6  divide-y"
              >
                <p className="mb-2 text-slate-500">
                  posted {formatTimeAgo(post?.created_time)}
                </p>
                <div className="flex flex-col justify-center w-full">
                  {post?.message && (
                    <div className="right-0 w-full">
                      <p>{post?.message || ""}</p>
                    </div>
                  )}
                  {post?.attachments?.data[0]?.media &&
                    (post?.attachments?.data[0]?.subattachments ? (
                      <ul className="flex flex-wrap justify-center">
                        {post?.attachments?.data[0]?.subattachments?.data.map((image:any, index:any) => (
                          <div key={index} className=" mb-2">
                            <img
                              src={image?.media?.image?.src}
                              className="w-[42rem] h-[28rem] self-center border-2 border-gray-200 rounded"
                            />
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <img
                        src={post.attachments.data[0].media.image.src}
                        className="w-[40rem] h-[28rem] self-center mt-2 border-2 border-gray-200 rounded"
                      />
                    ))}
                </div>
                <div className="mt-4 py-1 flex items-center justify-center hover:bg-blue-200 cursor-pointer">
                  Comments
                </div>
              </div>
            </PostModal>
          </div>
        ))}
      </div>
    </div>
  );
}
