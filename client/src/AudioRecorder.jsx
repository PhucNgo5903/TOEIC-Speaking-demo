import React, { useRef, useState } from "react";

function AudioRecorder({ topic, setResult, setLoading }) {
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
      formData.append("topic", topic);

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
    <div className="recorder">
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {isRecording && <p>Recording: {seconds} seconds</p>}
    </div>
  );
}

export default AudioRecorder;