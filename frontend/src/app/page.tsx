
'use client';
import facebookIcon from '../assets/icons/facebook.png';
import InstagramIcon from '../assets/icons/instagram.png';
import TiktokIcon from '../assets/icons/tiktok.png';
import SocialMedia from '../assets/icons/social-media.png';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'
import Link from 'next/link';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { useEffect } from 'react';

export default  function Home() {
  // const { data: session, status } = useSession();
  // console.log(session);
  // const fb=localStorage.getItem('access_token')

  // useEffect(() => {
  //   if (session) {
  //     localStorage.setItem('access_token', session.user.access_token);
  //     console.log('Session data stored in localStorage');
  //   }
  // }, [session]);



  return (
    
    <main className="flex flex-col min-h-screen  items-center justify-center bg-white ">
       <Link href="/messages">
   <div className="absolute top-0 right-0 me-8 mt-8 bg-gray-200 p-1 rounded-full cursor-pointer" >
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
</div>
</Link>
    <img src={SocialMedia.src} className="w-72 h-72"/>
    <p className='font-mono mt-8 text-m'>Welcome to</p>
    <p className='mb-32 font-mono m-4 text-xl'>Social Media Aggregator</p>
    <p className="font-mono me-1 text-l">Sign in with your Accounts</p>
    <hr className="w-72 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10 dark:bg-gray-700"/>
      <div className="flex w-full flex-row justify-center space-x-10">
      <Link href="/dashboard"> 
        <img src={facebookIcon.src} className="w-20 h-20 cursor-pointer"/>
       </Link> 
        <img src={InstagramIcon.src} className="w-20 h-20"/>
        <img src={TiktokIcon.src} className="w-20 h-20"/>
      </div>
   
  </main>
  );
}
