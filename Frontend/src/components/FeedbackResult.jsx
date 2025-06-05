import React from "react";

function FeedbackResult({ transcript, feedback }) {
  return (
    <div className="result">
      <h2>Transcript</h2>
      <p>{transcript}</p>

      <h2>AI Feedback</h2>
      <pre>{feedback}</pre>
    </div>
  );
}

export default FeedbackResult;