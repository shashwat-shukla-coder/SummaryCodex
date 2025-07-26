# 📝 NoteCodex – Your Smart Note Assistant
A full-stack note management application built with the MERN stack (MongoDB, Express, React, Node.js) and extended with a Flask-based summarization API to enhance productivity.

## 🚀 Features
✅ CRUD Operations and bookmark facility: Seamlessly create, read, update, and delete your personal notes and feature to bookmark the important notes for easy acces along with search filtering feature.

🔐 User Authentication: Secure login and registration with JWT-based authentication. All user data is protected and private.

🧠 Summarization Engine:

- ✨ Abstractive Summary: Condenses long notes using a T5-based deep learning model.

- 📌 Extractive Summary: Highlights key sentences with sentence-transformers.

- ⏱️ Benefit: Significantly reduces reading time for lengthy notes.

🗣️ Text-to-Speech: Listen to your notes through a built-in voice reader.

⬇️ Download Notes: Export your notes in clean .txt format.

📱 Responsive Design: Mobile-friendly interface built with React-Bootstrap.

🔄 State Management: Efficient and centralized handling of UI and data via Redux.

🛡️ Security & Middleware:

- Auth middleware to check Authentication of the tokens.

- Custom error handlers for graceful failures.

- Token-based user-specific access.

# 🛠️ Tech Stack
- Layer	Technology
- Frontend	React, React-Bootstrap
- Backend	Node.js, Express.js javascript
- API Communications	Axios
- Auth	JWT (JSON Web Tokens)
- State Mgmt	Redux
- Database	MongoDB (Mongoose ODM)
- AI APIs	Python (Flask), Transformers

# 📦 Installation & Setup
| Step | Description                          | Command(s)                                                                             |
| ---- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| 1️⃣  | **Clone the Repository**             | `git clone https://github.com/shashwat-shukla-coder/SummaryCodex.git` |
| 2️⃣  | **Install Node Dependencies (Root)** | `npm install`                                                                          |
| 3️⃣  | **Frontend Setup**                   | `cd frontend`<br>`npm install`<br>`npm start`                                          |
| 4️⃣  | **Start Flask Summarizer API**       | `cd summarizer`<br>`pip install -r requirements.txt`<br>`python app.py`                |

## Environment Variables
Set up environment variables in a .env file (in both the main project and frontend if needed):
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret
   - NODE_ENV=developemnt or production


📈 Future Scope
Add Google OAuth login.
Summarization caching for frequently accessed notes.
Dark mode toggle 🌙.
Before running this project, ensure you have the following installed:  
- Node.js  
- MongoDB
- flask with latest python version

---
