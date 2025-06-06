import React, { useEffect, useState } from "react";

function QuestionList({ onEdit }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;

    await fetch(`http://localhost:5000/api/questions/${id}`, {
      method: "DELETE",
    });

    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <div className="bg-white shadow p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h2>
      {questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li
              key={q._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>{q.text}</span>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(q)}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionList;
