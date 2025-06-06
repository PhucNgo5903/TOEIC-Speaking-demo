import React, { useState, useEffect } from "react";

function QuestionForm({ initialData, onSave }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (initialData) setText(initialData.text);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `http://localhost:5000/api/questions/${initialData._id}`
      : "http://localhost:5000/api/questions";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    onSave(data);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-md mb-6">
      <h2 className="text-lg font-semibold mb-3">
        {initialData ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
      </h2>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
      </div>
    </form>
  );
}

export default QuestionForm;
