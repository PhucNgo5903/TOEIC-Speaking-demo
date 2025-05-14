import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import FeedbackResult from "./FeedbackResult";
import "./index.css";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <h1>TOEIC Speaking Practice</h1>

      <label htmlFor="topic">Speaking Topic:</label>
      <input
        id="topic"
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your topic..."
      />

      <AudioRecorder topic={topic} setResult={setResult} setLoading={setLoading} />

      {loading && <p className="loading">Analyzing your speech...</p>}

      {result && <FeedbackResult transcript={result.text} feedback={result.feedback} />}
    </div>
  );
}

export default App;