import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LandingPage from "./screens/Landing/LandingPage";
import MyNotes from "./screens/Mynotes/MyNotes";
import CreateNote from "./screens/NewNote/CreateNote";
import SingleNote from "./screens/NewNote/SingleNote";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import SummaryNote from "./screens/NewNote/SummaryNote";
import { useSelector } from "react-redux";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");

  const { userInfo } = useSelector((state) => state.userLogin);

  const wakeUpRenderAPI = async () => {
    try {
      const res = await axios.get("https://summarizer-api-qydn.onrender.com/");
      console.log("Render API awake:", res.data);
    } catch (error) {
      console.error("Wake-up failed:", error.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      wakeUpRenderAPI();
    }
  }, [userInfo]);

  return (
    <>
      <BrowserRouter>
        <Header setSearch={(s) => setSearch(s)} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} exact />
            <Route path="/mynotes" element={<MyNotes search={search} />} />
            <Route path="/createnote" element={<CreateNote />} />
            <Route path="/note/:id" element={<SingleNote />} />
            <Route path="/note/summary/:id" element={<SummaryNote />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
