import React from "react";

function FeedbackResult({ transcript, feedback }) {
  return (
    <div className="bg-white shadow rounded-md p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Transcript</h3>
        <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
          {transcript}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700">AI Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-yellow-50 p-3 rounded-md text-sm text-gray-900">
            <h4 className="font-semibold mb-2">1. Grammar & Vocabulary</h4>
            <p className="whitespace-pre-wrap">{feedback.grammar}</p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-md text-sm text-gray-900">
            <h4 className="font-semibold mb-2">2. Content Logic</h4>
            <p className="whitespace-pre-wrap">{feedback.contentLogic}</p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-md text-sm text-gray-900">
            <h4 className="font-semibold mb-2">3. Fluency & Pronunciation</h4>
            <p className="whitespace-pre-wrap">{feedback.fluency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackResult;