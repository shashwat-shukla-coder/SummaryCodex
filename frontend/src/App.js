import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LandingPage from "./screens/Landing/LandingPage";
import MyNotes from "./screens/Mynotes/MyNotes";
import CreateNote from "./screens/NewNote/CreateNote";
import SingleNote from "./screens/NewNote/SingleNote";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SummaryNote from "./screens/NewNote/SummaryNote";

// classname instead of class as in html
// fragmentation
function App() {
  const [search, setSearch] = useState("");
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
            <Route path="/notes/:id" element={<SummaryNote />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
