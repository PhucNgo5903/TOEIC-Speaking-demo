import React, { useRef, useState } from "react";
import { Mic, StopCircle } from "lucide-react";

function AudioRecorder({ questionId, setResult, setLoading }) {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    setResult(null);
    setLoading(false);
    setSeconds(0);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("questionId", questionId);

      setLoading(true);

      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setResult(data);
      } catch (err) {
        alert("Upload failed.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  return (
    <div className="bg-white rounded-md shadow p-4 mb-6 flex flex-col items-center">
      <div className="flex space-x-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          <Mic size={20} />
          Ghi âm
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
        >
          <StopCircle size={20} />
          Dừng lại
        </button>
      </div>
      {isRecording && (
        <p className="mt-3 text-sm text-gray-600">
          Đang ghi âm: <span className="font-semibold">{seconds}s</span>
        </p>
      )}
    </div>
  );
}

export default AudioRecorder;
