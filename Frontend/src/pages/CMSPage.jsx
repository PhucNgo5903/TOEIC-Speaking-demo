import React, { useState } from "react";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";

function CMSPage() {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleEdit = (question) => setEditingQuestion(question);

  const handleSave = () => {
    setEditingQuestion(null);
    setRefreshFlag((f) => !f);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Quản lý câu hỏi Speaking</h1>
      <QuestionForm initialData={editingQuestion} onSave={handleSave} />
      <QuestionList key={refreshFlag} onEdit={handleEdit} />
    </div>
  );
}

export default CMSPage;
