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
    <div>
      <h2>Danh sách câu hỏi</h2>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            {q.text}{" "}
            <button onClick={() => onEdit(q)}>Sửa</button>{" "}
            <button onClick={() => handleDelete(q._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
