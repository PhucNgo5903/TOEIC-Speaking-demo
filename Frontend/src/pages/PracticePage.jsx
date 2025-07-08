import React, { useEffect, useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import FeedbackResult from "../components/FeedbackResult";

function PracticePage() {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setQuestion(data[randomIndex]);
          setSelectedQuestionId(data[randomIndex]._id);
        }
      });
  }, []);

  const pickRandomQuestion = () => {
    if (questions.length > 1) {
      let randomIndex;
      let newQuestion;
      do {
        randomIndex = Math.floor(Math.random() * questions.length);
        newQuestion = questions[randomIndex];
      } while (newQuestion._id === question._id);
      setQuestion(newQuestion);
      setSelectedQuestionId(newQuestion._id);
      setResult(null);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question._id,
          transcript: result.text,
          feedback: result.feedback,
        }),
      });

      if (res.ok) {
        alert("Đã lưu bài nói!");
        setSaved(true);
      } else {
        alert("Lưu thất bại.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Lỗi khi lưu bài nói.");
    }
  };

  const handleSelectQuestion = (e) => {
    const selectedId = e.target.value;
    setSelectedQuestionId(selectedId);
    const found = questions.find((q) => q._id === selectedId);
    if (found) {
      setQuestion(found);
      setResult(null);
      setSaved(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
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

          {/* Chọn câu hỏi thủ công */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Chọn câu hỏi:</label>
            <select
              value={selectedQuestionId}
              onChange={handleSelectQuestion}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {questions.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.text}
                </option>
              ))}
            </select>
          </div>

          <AudioRecorder
            topic={question.text}
            questionId={question._id}
            setResult={(res) => {
              setResult(res);
              setSaved(false);
            }}
            setLoading={setLoading}
          />

          {loading && (
            <p className="text-blue-600 animate-pulse">Đang phân tích giọng nói...</p>
          )}

          {result && (
            <>
              <FeedbackResult
                transcript={result.text}
                feedback={result.feedback}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`mt-2 px-4 py-2 rounded text-white ${
                    saved ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {saved ? "Đã lưu" : "Lưu bài nói"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Đang tải câu hỏi...</p>
      )}
    </div>
  );
}

export default PracticePage;
