# AI-AGENT - Collaborative Development Platform

A real-time collaborative development platform that combines the power of AI assistance with live code editing, project management, and seamless team collaboration. Built with the MERN stack and featuring WebContainer integration for in-browser code execution.

## 🌟 Features

### 🤖 AI-Powered Development
- **Smart Code Generation**: AI assistant powered by Google's Gemini 2.0 Flash
- **Interactive Chat**: Type `@ai` in project chat to get AI assistance
- **File Tree Generation**: AI can create complete project structures
- **Best Practices**: AI follows modern development patterns and error handling

### 🔄 Real-Time Collaboration
- **Live Chat**: Real-time messaging within projects
- **User Management**: Add/remove collaborators dynamically
- **Socket.io Integration**: Instant message delivery and user notifications
- **Project Rooms**: Isolated communication channels per project

### 💻 In-Browser Code Execution
- **WebContainer Integration**: Run Node.js projects directly in the browser
- **Live Preview**: See your applications running in real-time
- **Package Management**: Automatic npm install and dependency resolution
- **File System**: Complete file editing and management system

### 🛡️ Security & Authentication
- **JWT-based Auth**: Secure user authentication
- **Protected Routes**: Route-level access control
- **Redis Session Management**: Secure token blacklisting
- **Project-based Permissions**: User access control per project

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   Express API   │◄──►│    MongoDB      │
│                 │    │                 │    │                 │
│ • Real-time UI  │    │ • REST API      │    │ • User Data     │
│ • WebContainer  │    │ • Socket.io     │    │ • Projects      │
│ • Code Editor   │    │ • Authentication│    │ • File Trees    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────►│                 │◄─────────────┘
                        │ • Session Mgmt  │
                        │ • Token Cache   │
                        └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local or Atlas)
- **Redis** (for session management)

### 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/kanhaiya1202/AI-AGENT.git
cd AI-AGENT
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### 🔧 Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-agent
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-agent

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Google AI Configuration
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio

# Redis Configuration (for session management)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Frontend Environment (.env)
Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Development Configuration
VITE_NODE_ENV=development
```

### 🔑 Getting API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### ▶️ Running the Application

#### Development Mode

1. **Start the Backend Server**
```bash
cd backend
npm run dev
# or
node server.js
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Production Mode

1. **Build the Frontend**
```bash
cd frontend
npm run build
```

2. **Start the Backend in Production**
```bash
cd backend
NODE_ENV=production node server.js
```

## 📁 Project Structure

```
AI-AGENT/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── ai.controller.js
│   │   ├── project.controller.js
│   │   └── user.controller.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.middleware.js
│   ├── model/               # Database schemas
│   │   ├── project.model.js
│   │   └── user.model.js
│   ├── routes/              # API routes
│   │   ├── ai.routes.js
│   │   ├── project.routes.js
│   │   └── user.routes.js
│   ├── services/            # Business logic
│   │   ├── ai.services.js
│   │   ├── project.services.js
│   │   ├── redis.services.js
│   │   └── user.service.js
│   ├── db/                  # Database configuration
│   │   └── db.js
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── component/       # Reusable components
│   │   ├── config/         # Configuration files
│   │   │   ├── axios.js    # API client setup
│   │   │   ├── socket.js   # Socket.io client
│   │   │   └── webcontainer.js # WebContainer setup
│   │   ├── context/        # React context providers
│   │   ├── routes/         # Route definitions
│   │   ├── screens/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Project.jsx
│   │   │   └── Register.jsx
│   │   └── main.jsx        # React entry point
│   └── index.html
└── README.md
```

## 🔄 Application Workflow

### 1. User Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant R as Redis

    U->>F: Login/Register
    F->>B: POST /users/login
    B->>DB: Validate credentials
    DB->>B: User data
    B->>B: Generate JWT token
    B->>F: Return user + token
    F->>F: Store token in localStorage
    F->>U: Redirect to dashboard
```

### 2. Project Creation & Collaboration
```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    U1->>F: Create Project
    F->>B: POST /projects/create
    B->>DB: Save project
    DB->>B: Project created
    B->>F: Return project data
    
    U1->>F: Add User 2 to project
    F->>B: PUT /projects/add-user
    B->>DB: Update project users
    DB->>B: Updated project
    B->>F: Return updated project
    
    U2->>F: Access project
    F->>B: GET /projects/get-project/:id
    B->>DB: Fetch project
    DB->>B: Project data
    B->>F: Return project with users
```

### 3. Real-Time Messaging Flow
```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant S1 as Socket 1
    participant S2 as Socket 2
    participant B as Backend
    participant AI as AI Service

    U1->>S1: Send message
    S1->>B: project-message event
    B->>S2: Broadcast to project room
    S2->>U2: Display message
    
    Note over U1,AI: AI Integration
    U1->>S1: Send "@ai create express app"
    S1->>B: project-message with @ai
    B->>AI: Generate code
    AI->>B: Return file tree + code
    B->>S1: Broadcast AI response
    B->>S2: Broadcast AI response
    S1->>U1: Display AI response
    S2->>U2: Display AI response
```

### 4. WebContainer Code Execution
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant W as WebContainer
    participant AI as AI Service

    AI->>F: Generate file tree
    F->>W: Mount file tree
    W->>W: Set up file system
    
    U->>F: Click "Run Project"
    F->>W: spawn("npm", ["install"])
    W->>W: Install dependencies
    W->>F: Installation complete
    
    F->>W: spawn("npm", ["start"])
    W->>W: Start development server
    W->>F: server-ready event with URL
    F->>F: Display preview in iframe
```

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (protected)
- `GET /users/logout` - Logout user (protected)
- `GET /users/all` - Get all users (protected)

### Project Endpoints
- `POST /projects/create` - Create new project (protected)
- `GET /projects/all` - Get user's projects (protected)
- `GET /projects/get-project/:id` - Get project by ID (protected)
- `PUT /projects/add-user` - Add users to project (protected)
- `PUT /projects/update-file-tree` - Update project file tree (protected)

### AI Endpoints
- `GET /ai/get-result?prompt=` - Get AI response for prompt

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Route protection** using middleware
- **Token blacklisting** using Redis for logout functionality
- **Project-level permissions** ensuring users can only access their projects

### Input Validation
- **Express-validator** for request data validation
- **MongoDB injection prevention** through Mongoose
- **XSS protection** through input sanitization

### Cross-Origin Security
- **CORS configuration** for secure cross-origin requests
- **Cross-Origin Isolation headers** for WebContainer compatibility

## 🤖 AI Integration Details

### AI Capabilities
The AI assistant is powered by Google's Gemini 2.0 Flash model and can:

- **Generate complete project structures** with proper file organization
- **Create modular, scalable code** following best practices
- **Handle error cases** and edge conditions
- **Provide explanations** and documentation
- **Suggest improvements** to existing code

### AI Prompt Format
Users can interact with AI by typing `@ai` followed by their request:
```
@ai create a REST API for user management
@ai add authentication to this express app
@ai create a React component for user dashboard
```

### AI Response Format
The AI returns structured JSON responses:
```json
{
  "text": "Here's your Express.js application with user authentication...",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express');\n// Complete application code..."
      }
    },
    "package.json": {
      "file": {
        "contents": "{\n  \"name\": \"user-auth-app\",\n  // Complete package.json..."
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "npm",
    "commands": ["start"]
  }
}
```

## 🌐 WebContainer Integration

### Requirements
WebContainer requires specific browser security headers:
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`

### Supported Features
- **In-browser Node.js execution**
- **NPM package installation**
- **File system operations**
- **Development server hosting**
- **Live preview functionality**

### Limitations
- Requires modern browsers with SharedArrayBuffer support
- Must be served over HTTPS in production
- Limited to Node.js-based projects

## 🔧 Troubleshooting

### Common Issues

#### WebContainer Not Working
```bash
# Check browser console for errors
# Ensure HTTPS in production
# Verify cross-origin headers are set
```

#### Socket Connection Failed
```bash
# Check if backend is running
# Verify CORS configuration
# Check token in localStorage
```

#### AI Not Responding
```bash
# Verify GEMINI_API_KEY in .env
# Check API quota limits
# Review network connectivity
```

#### Database Connection Issues
```bash
# Verify MongoDB is running
# Check MONGODB_URI format
# Ensure database permissions
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up custom headers for WebContainer support

### Backend Deployment (Railway/Heroku)
1. Set environment variables
2. Configure MongoDB Atlas connection
3. Set up Redis instance
4. Deploy with proper CORS settings

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add appropriate error handling
- Include proper validation
- Write meaningful commit messages
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for Gemini API
- **StackBlitz** for WebContainer technology
- **Socket.io** for real-time communication
- **MongoDB** for database solutions
- **Vercel** for hosting and deployment

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using MERN Stack + AI**