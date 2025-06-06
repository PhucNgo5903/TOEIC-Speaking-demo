import React, { useEffect, useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import FeedbackResult from "../components/FeedbackResult";

function PracticePage() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gọi API khi load lần đầu
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setQuestion(data[randomIndex]);
        }
      });
  }, []);

  // Hàm random lại câu hỏi từ danh sách đã có
  const pickRandomQuestion = () => {
    if (questions.length > 1) {
      let randomIndex;
      let newQuestion;

      // Lặp đến khi chọn được câu hỏi khác câu hiện tại
      do {
        randomIndex = Math.floor(Math.random() * questions.length);
        newQuestion = questions[randomIndex];
      } while (newQuestion._id === question._id);

      setQuestion(newQuestion);
      setResult(null); // Xóa kết quả feedback cũ
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Luyện Speaking TOEIC</h1>

      {question ? (
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Câu hỏi: {question.text}
            </h2>
            <button
              onClick={pickRandomQuestion}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Đổi câu hỏi
            </button>
          </div>

          <AudioRecorder
            topic={question.text}
            questionId={question._id}
            setResult={setResult}
            setLoading={setLoading}
          />

          {loading && (
            <p className="text-blue-600 animate-pulse">Đang phân tích giọng nói...</p>
          )}

          {result && (
            <FeedbackResult
              transcript={result.text}
              feedback={result.feedback}
            />
          )}
        </div>
      ) : (
        <p>Đang tải câu hỏi...</p>
      )}
    </div>
  );
}

export default PracticePage;
