import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LandingPage from "./screens/Landing/LandingPage";
import MyNotes from "./screens/Mynotes/MyNotes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// classname instead of class as in html
// fragmentation
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} exact />
            <Route path="/mynotes" element={<MyNotes />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
