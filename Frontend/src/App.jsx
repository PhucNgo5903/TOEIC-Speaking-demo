import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CMSPage from "./pages/CMSPage";
import PracticePage from "./pages/PracticePage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Practice</Link> | <Link to="/cms">Quản lý câu hỏi</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PracticePage />} />
        <Route path="/cms" element={<CMSPage />} />
      </Routes>
    </Router>
  );
}

export default App;
