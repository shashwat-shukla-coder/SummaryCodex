
NoteCodex
A Feature-Rich, Secure Note-Taking and Storage Application

Welcome to NoteCodex! This application is designed to help users create, manage, and securely store notes with ease. Built with the MERN (MongoDB, Express, React, Node.js) stack, it provides a seamless and responsive user experience for note-taking.

Features
CRUD Operations: Create, Read, Update, and Delete notes effortlessly.
User Authentication: Secure login and registration using JWT-based authentication.
Markdown Compatibility: Leverage React Markdown to format and render notes.
Responsive Design: A clean, mobile-friendly UI built with React-Bootstrap.
State Management: Centralized state management with Redux for better performance.
Error Handling: Robust middleware for authorization, role-based access, and error handling.
Tech Stack
Frontend: React, Redux, React-Bootstrap, React Markdown
Backend: Express.js, Node.js
Database: MongoDB with Mongoose
State Management: Redux
API Communication: Axios
Authentication: JSON Web Tokens (JWT)
Getting Started
Prerequisites
Before running this project, ensure you have the following installed:

Node.js
MongoDB
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/shashwat-shukla-coder/NoteCodex.git  
cd NoteCodex  
Install dependencies for the frontend and backend:

bash
Copy code
cd frontend  
npm install  
cd ../backend  
npm install  
Configure environment variables:
Create a .env file in the backend directory and add:

env
Copy code
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
NODE_ENV=development  
Running the Application
Start the backend server:

bash
Copy code
cd backend  
npm run server  
Start the frontend:

bash
Copy code
cd frontend  
npm start  
Open your browser and navigate to:

arduino
Copy code
http://localhost:3000  
Project Structure
Backend
Models: MongoDB schemas for users and notes.
Routes: Endpoints for user authentication and note management.
Middleware: JWT-based authentication and error handling.
Frontend
Components: Reusable components for UI elements like login, register, and note forms.
Pages: Main pages such as Login, Register, and Notes Dashboard.
Redux Store: Centralized store for managing application state.
Screenshots
Landing Page

Notes Dashboard

