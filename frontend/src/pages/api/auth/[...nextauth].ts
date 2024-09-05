import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';



dotenv.config();

const options = {
  configId: '484684144524104',
  providers: [

    FacebookProvider({

      clientId: process.env.FACEBOOK_ID|| '',
      clientSecret: process.env.FACEBOOK_SECRET||'',
    }),

  ],
  callbacks:{
    async jwt({token,user,account}:any){
      
      // token.accessToken = account?.access_token;
      return{...token,...user,...account}
    },
    async session({session,token,user}:any){
      // session.token = token.accessToken;
      // session.user.token = token.accessToken;
      session.user= token;
      return session 
    }
    
  },
  debug: true,
};
export default (req:NextApiRequest, res:NextApiResponse ) => NextAuth(req, res, options)