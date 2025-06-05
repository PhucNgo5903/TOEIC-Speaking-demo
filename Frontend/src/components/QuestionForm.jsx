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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nhập câu hỏi"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type="submit">{initialData ? "Cập nhật" : "Thêm"}</button>
    </form>
  );
}

export default QuestionForm;
