import React, { useState } from "react";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";

function CMSPage() {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleEdit = (question) => setEditingQuestion(question);

  const handleSave = () => {
    setEditingQuestion(null);
    setRefreshFlag((f) => !f); // kích hoạt reload danh sách
  };

  return (
    <div>
      <h1>Quản lý câu hỏi</h1>
      <QuestionForm initialData={editingQuestion} onSave={handleSave} />
      <QuestionList key={refreshFlag} onEdit={handleEdit} />
    </div>
  );
}

export default CMSPage;
