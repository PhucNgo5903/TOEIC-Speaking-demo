import React from "react";

function FeedbackResult({ transcript, feedback }) {
  return (
    <div className="bg-white shadow rounded-md p-6 space-y-6">
      {/* Transcript */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Bản ghi chép</h3>
        <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
          {transcript}
        </p>
      </div>

      {/* Feedback and Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Chi tiết từng phần nhận xét */}
        <div className="md:col-span-3 space-y-4">
          {/* Grammar & Vocabulary */}
          <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-1">
              1. Grammar & Vocabulary
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {feedback.grammar.comment}
            </p>
          </div>

          {/* Content Logic */}
          <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-1">
              2. Content Logic
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {feedback.contentLogic.comment}
            </p>
          </div>

          {/* Fluency & Pronunciation */}
          <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-1">
              3. Fluency & Pronunciation
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {feedback.fluency.comment}
            </p>
          </div>
        </div>

        {/* Bảng chấm điểm IELTS */}
        <div className="bg-blue-50 p-4 rounded-md shadow-md space-y-3">
          <h4 className="text-lg font-bold text-blue-700 mb-2">
            Band điểm 
          </h4>
          <div className="text-sm space-y-1 text-gray-800">
            <p>
              <strong>Grammar:</strong> {feedback.grammar.score} / 9
            </p>
            <p>
              <strong>Content:</strong> {feedback.contentLogic.score} / 9
            </p>
            <p>
              <strong>Fluency:</strong> {feedback.fluency.score} / 9
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackResult;
