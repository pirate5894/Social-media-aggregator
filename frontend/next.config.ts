module.exports = {
  // Enable CORS for the backend API
  async middleware(middleware: any) {
    const cors = require('next/cors');
    middleware.use(cors({
      origin: ['http://localhost:5000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }));
  },

  // Proxy configuration for the frontend
  async rewrites() {
    return [
      {
        source: '/facebook',
        destination: 'http://localhost:3000',
      },
    ];
  },
};