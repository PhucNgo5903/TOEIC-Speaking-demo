import React, { useEffect, useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import FeedbackResult from "../components/FeedbackResult";

function PracticePage() {
    const [question, setQuestion] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/questions")
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setQuestion(data[randomIndex]);
                }
            });
    }, []);

    return (
        <div className="container">
            <h1>TOEIC Speaking Practice</h1>

            {question ? (
                <>
                    <h3>Topic: {question.text}</h3>

                    <AudioRecorder
                        topic={question.text}
                        questionId={question._id}
                        setResult={setResult}
                        setLoading={setLoading}
                    />

                    {loading && <p className="loading">Analyzing your speech...</p>}

                    {result && (
                        <FeedbackResult transcript={result.text} feedback={result.feedback} />
                    )}
                </>
            ) : (
                <p>Loading question...</p>
            )}
        </div>
    );
}

export default PracticePage;
