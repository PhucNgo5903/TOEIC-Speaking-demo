import React, { useEffect, useState } from "react";

function ArchivePage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách bài nói từ server
  useEffect(() => {
    fetch("http://localhost:5000/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch submissions error:", err);
        setLoading(false);
      });
  }, []);

  // Hàm xoá bài nói
  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá bài nói này?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Cập nhật lại danh sách sau khi xoá
        setSubmissions((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Xoá thất bại.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Lỗi khi xoá.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Danh sách các bài nói đã lưu
      </h1>

      {loading ? (
        <p className="text-blue-500 text-center">Đang tải dữ liệu...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-600 text-center">Chưa có bài nói nào được lưu.</p>
      ) : (
        <div className="space-y-8">
          {submissions.map((sub, index) => (
            <div key={sub._id} className="bg-white shadow-md rounded-md p-6 space-y-6">
              {/* Tiêu đề câu hỏi + nút xoá */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Câu hỏi {index + 1}: {sub.question?.text}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  🗑️ Xoá
                </button>
              </div>

              {/* Transcript */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Bản ghi chép</h3>
                <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
                  {sub.transcript}
                </p>
              </div>

              {/* Feedback + Band điểm */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Nhận xét chi tiết */}
                <div className="md:col-span-3 space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      1. Grammar & Vocabulary
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {sub.feedback.grammar?.comment}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      2. Content Logic
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {sub.feedback.contentLogic?.comment}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      3. Fluency & Pronunciation
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {sub.feedback.fluency?.comment}
                    </p>
                  </div>
                </div>

                {/* Bảng điểm */}
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
                    { label: "Grammar", value: sub.feedback.grammar?.score },
                    { label: "Content", value: sub.feedback.contentLogic?.score },
                    { label: "Fluency", value: sub.feedback.fluency?.score },
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
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivePage;
