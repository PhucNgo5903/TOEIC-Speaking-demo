import React from "react";

function FeedbackResult({ transcript, feedback }) {
  return (
    <div className="bg-white shadow rounded-md p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Transcript</h3>
        <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
          {transcript}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700">AI Feedback</h3>
        <pre className="bg-yellow-50 p-3 rounded-md text-sm text-gray-900 whitespace-pre-wrap">
          {feedback}
        </pre>
      </div>
    </div>
  );
}

export default FeedbackResult;
