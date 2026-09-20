# QueryFlow

QueryFlow is a full-stack AI-powered chat application that combines secure authentication, persistent chat history, and real-time AI responses with live internet search support. The app is designed as a modern portfolio-ready project and demonstrates end-to-end full-stack development with React, Node.js, MongoDB, Socket.IO, and AI APIs.

## Overview

QueryFlow lets users:

- Create an account and log in securely
- Verify their email before using the app
- Start new AI chats and continue previous conversations
- Send prompts to an AI assistant powered by Google Gemini
- Use live web search when the user asks for current/latest information
- Receive responses in a chat-style interface with markdown rendering
- Delete chats and keep a clean conversation list
- Experience real-time updates using Socket.IO

This project is structured as a monorepo with a separate frontend and backend, making it easy to extend for production use, portfolio showcasing, or future deployments.

## Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Markdown

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Nodemailer
- LangChain
- Google Gemini API
- Tavily API
- Express Validator

## Features

### Authentication

- Register with username, email, and password
- Email verification link sent via Gmail SMTP/OAuth2
- Login with JWT-based session cookies
- Protected routes for authenticated users
- User data retrieval via authenticated middleware
- Resend verification email option

### AI Chat Experience

- Create a new chat thread
- Send messages to the AI assistant
- Maintain chat history per user
- Generate automatic short conversation titles
- Show AI responses with markdown formatting
- Support for current-news and live-information prompts using web search

### Real-Time Functionality

- Socket.IO server for live connection tracking
- Real-time chat session interactions for future live collaboration or push updates

### Data Management

- MongoDB collections for users, chats, and messages
- Chat and message ownership checks for secure access
- Delete chat functionality with associated messages cleanup

## Project Structure

```bash
QueryFlow/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── chat.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── chat.model.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── chat.routes.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   ├── internet.service.js
│   │   │   └── mail.service.js
│   │   ├── sockets/
│   │   │   └── server.socket.js
│   │   └── validators/
│   │       └── auth.validator.js
│   ├── package.json
│   ├── server.js
│   └── .env (not committed)
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env (not committed)
├── README.md
└── .gitignore
```

## Environment Variables

Create a `.env` file inside the `backend` folder with the following values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_USER=your_gmail_address
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
PORT=3000
```

For the frontend, if you are using environment-based API URLs, create a `.env` in the `frontend` folder as needed:

```env
VITE_API_URL=http://localhost:3000
```

## Installation

### 1. Clone the project

```bash
git clone <your-repository-url>
cd QueryFlow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

or:

```bash
cd backend
npm start
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Then open the frontend in your browser:

```text
http://localhost:5173
```

## API Overview

### Authentication

- `POST /api/auth/register` — register a new user
- `GET /api/auth/verify-email?token=...` — verify email
- `POST /api/auth/login` — log in
- `GET /api/auth/me` — fetch current authenticated user
- `POST /api/auth/resend-verification` — resend verification email

### Chat

- `POST /api/chats/message` — send a message and generate AI response
- `GET /api/chats` — fetch all chats for current user
- `GET /api/chats/:chatId/messages` — fetch messages for one chat
- `DELETE /api/chats/delete/:chatId` — delete a chat

## How It Works

1. The user signs up and verifies their email.
2. The frontend stores the authenticated state and redirects to the dashboard.
3. The user sends a message from the chat interface.
4. The backend checks whether the message is a live information request.
5. If needed, the app searches the web using Tavily and then generates a response with Gemini.
6. The message and AI answer are stored in MongoDB.
7. The chat title is auto-generated based on the initial prompt.
8. Socket.IO provides the real-time connection layer for the app.

## Why This Project Is Good for a Portfolio

QueryFlow demonstrates real-world full-stack engineering skills:

- Authentication with secure sessions and email verification
- AI integration with external APIs
- Real-time app communication with Socket.IO
- Practical database schema design
- Frontend state management and route protection
- Full-stack project organization with a monorepo structure
- Production-style API and service architecture

## Future Improvements

- Add chat streaming for faster AI responses
- Add dark/light mode switching
- Add user profile editing
- Add message editing and deletion
- Add deployment with Docker and cloud hosting
- Add rate limiting and better security hardening
- Add more advanced search and summarization features

## License

This project is currently for personal portfolio and learning purposes. You can customize and extend it as needed.

## Author

Built as a full-stack AI app project for portfolio and resume use.
