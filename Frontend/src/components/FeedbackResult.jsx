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

        <div className="bg-blue-50 p-4 rounded-xl shadow-lg space-y-3 border border-blue-200">
          <h4 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11 17a4 4 0 00.88 2.91l.12.09a4 4 0 005.66-5.66l-.09-.12a4 4 0 00-2.91-.88M13.41 6.59a2 2 0 012.83 0l1.17 1.17a2 2 0 010 2.83L9 20H5v-4L13.41 6.59z" />
            </svg>
            Band điểm IELTS
          </h4>

          {[
            { label: "Grammar", value: feedback.grammar.score },
            { label: "Content", value: feedback.contentLogic.score },
            { label: "Fluency", value: feedback.fluency.score },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{label}</span>
                <span>{value} / 9</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(value / 9) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeedbackResult;
