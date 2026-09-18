import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/generate-quiz", {
        method: "POST",
        body: "{}",
      });

      if (!data?.questions || data.questions.length === 0) {
        throw new Error("AI did not return any questions.");
      }

      setQuestions(data.questions);
      setAnswers({});
      setCurrent(0);
    } catch (err) {
      console.error("Failed to load quiz:", err);
      setError(err.message || "Unable to load AI quiz.");
    } finally {
      setLoading(false);
    }
  }

  const selectAnswer = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: optionIndex,
    }));
  };

  function handleNext() {
    if (answers[current] === undefined) {
      alert("Please select an answer before continuing.");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  }

  async function submitQuiz() {
    const score = questions.reduce((total, q, i) => {
      return total + (Number(q.correctAnswer) === Number(answers[i]) ? 1 : 0);
    }, 0);

    const categories = {};
    questions.forEach((q, i) => {
      const cat = q.category || "General";
      if (!categories[cat]) {
        categories[cat] = { correct: 0, total: 0 };
      }
      categories[cat].total += 1;
      if (Number(q.correctAnswer) === Number(answers[i])) {
        categories[cat].correct += 1;
      }
    });

    const user = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

    try {
      await api("/api/quiz-result", {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id,
          score,
          total: questions.length,
          answers,
          categories,
        }),
      });
    } catch (err) {
      console.warn("Could not save results to server:", err.message);
    }

    sessionStorage.setItem(
      "quizResult",
      JSON.stringify({ score, total: questions.length, categories })
    );

    navigate("/result");
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="center-page">
        <div className="loading-card">
          <div className="spinner"></div>
          <h2>Generating your AI quiz...</h2>
          <p>Please wait a few seconds.</p>
        </div>
      </div>
    );
  }

  // Error Screen (matches the UI card)
  if (error) {
    return (
      <div className="center-page">
        <div className="error-card">
          <h2>❌ Unable to load AI quiz</h2>
          <p>{error}</p>
          <div className="btn-group">
            <button className="primary-btn" onClick={loadQuiz}>
              Try Again
            </button>
            <Link className="secondary-btn" to="/">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <nav className="navbar">
        <Link className="brand" to="/">
          🧭 Career Compass
        </Link>
        <span className="question-count">
          Question {current + 1} of {questions.length}
        </span>
      </nav>

      <main className="quiz-container">
        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-card">
          <span className="badge">{q.category?.toUpperCase() || "CAREER ASSESSMENT"}</span>
          <h2>{q.question}</h2>

          <div className="options">
            {q.options?.map((option, i) => (
              <button
                key={i}
                className={`option ${answers[current] === i ? "selected" : ""}`}
                onClick={() => selectAnswer(i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                {option}
              </button>
            ))}
          </div>

          <button className="primary-btn full" onClick={handleNext}>
            {current === questions.length - 1 ? "Finish Quiz →" : "Next Question →"}
          </button>
        </div>
      </main>
    </div>
  );
}