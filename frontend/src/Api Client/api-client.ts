import axios from 'axios';

const appId = process.env.APP_ID;
const apiClient= axios.create({
  baseURL: `https://www.facebook.com/v20.0/dialog`,
  proxy: {
    host: 'localhost',
    port: 5000,
  },
  params: {
    origin: 'http://localhost:5000',
  },
});

export default apiClient;



// &redirect_uri=${redirectUri}
// import axios from 'axios';
// import { proxy } from 'axios-proxy';

// const apiClient = axios.create();

// api.interceptors.push(proxy('https://www.facebook.com/v3.2/dialog/oauth', {
//   target: 'http://localhost:5000',
//   changeOrigin: true,
// }));




// export default apiClient;

// import axios, { AxiosInstance } from 'axios';
// import * as tunnel from '';
//    const agent = tunnel.httpsOverHttp({
//    proxy: {
//      host: 'proxy.mycorp.com',
//      port: 8000,
//     },
//    });
// const axiosClient: AxiosInstance = axios.create({
// baseURL: 'https://some.api.com',
// httpsAgent: agent,
// });




// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const apiClient = express.Router();
// apiClient.use(cors());

// apiClient.post('/', async (req:any, res:any) => {
//   try {
//     const response = await axios.post('https://www.facebook.com/v3.2/dialog/oauth', req.body);
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to proxy request' });
//   }
// });
// export default apiClient

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FacebookAuth = () => {
//   const [token, setToken] = useState('');
//   const [user, setUser] = useState('');

//   const handleFacebookLogin = async () => {
//     const appId = process.env.APP_ID;
//     const redirectUri = 'http://localhost:3000/api/facebook/redirect';
//     const scope = 'email';
//     const fbGraphVersion = 'v20.0';

//     const authUrl = `https://www.facebook.com/v${fbGraphVersion}/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}`;

//     window.location.href = authUrl;
//   };

//   const handleFacebookRedirect = async () => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const accessToken = searchParams.get('access_token');
//     const expiresIn = searchParams.get('expires_in');

//     if (accessToken) {
//       setToken(accessToken);

//       const profileUrl = `https://graph.facebook.com/v${fbGraphVersion}/me?access_token=${accessToken}&fields=name,email`;
//       const response = await axios.get(profileUrl);

//       const userData = response.data;
//       setUser(userData);
//     }
//   };

//   useEffect(() => {
//     handleFacebookRedirect();
//   }, []);

//   return (
//     <div>
//       {token ? (
//         <div>
//           <h1>Welcome, {user}!</h1>
//           <p>Email: {user.email}</p>
//         </div>
//       ) : (
//         <button onClick={handleFacebookLogin}>Login with Facebook</button>
//       )}
//     </div>
//   );
// };

// export default FacebookAuth;