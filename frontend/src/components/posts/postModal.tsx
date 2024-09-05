"use client";
import "@/app/globals.css";

 
export default function PostModal({ isOpen, onClose, children }:any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 h-screen ">
    <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-[90%] mx-4 max-h-[90%]">
      <div className="max-h-[60vh] overflow-auto pr-2 mb-12">
      {children}
      </div>
      <button
        className="mt-8 absolute bottom-3 right-4 bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded shadow-md text-white "
        onClick={onClose}
      >
       Close
      </button>
    </div>
  </div>
  );
}
