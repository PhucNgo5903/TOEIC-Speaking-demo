import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CMSPage from "./pages/CMSPage";
import PracticePage from "./pages/PracticePage";

function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="text-xl font-bold">TOEIC Speaking</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Luyện tập</Link>
          <Link to="/cms" className="hover:underline">Quản lý câu hỏi</Link>
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<PracticePage />} />
          <Route path="/cms" element={<CMSPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
