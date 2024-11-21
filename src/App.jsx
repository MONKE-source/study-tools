import "./App.css";

// libraries
import { Navigate, useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PomodoroTimer />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </BrowserRouter>
  );
}

function PomodoroTimer() {
  const [studyTime, setStudyTime] = useState(null);
  const [breakTime, setBreakTime] = useState(null);
  const [ready, setReady] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mode, setMode] = useState("study");
  const navigate = useNavigate();

  // Format time into minutes and seconds
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  useEffect(() => {
    if (!ready || !studyTime || !breakTime) return;

    const timer = setTimeout(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    if (mode === "study" && timeElapsed >= studyTime * 60) {
      setTimeElapsed(0);
      setMode("break");
    } else if (mode === "break" && timeElapsed >= breakTime * 60) {
      setTimeElapsed(0);
      setMode("study");
    }

    return () => clearTimeout(timer); // Cleanup timer on component re-render
  }, [timeElapsed, mode, ready, studyTime, breakTime]);

  return (
    <div id="background">
      <div id="card">
        <p id="header">Pomodoro Timer</p>

        {!ready ? (
          <>
            <form>
              <p>Amount to study per cycle</p>
              <div className="radio-container">
                <label>
                  <input
                    type="radio"
                    name="study-time"
                    value="25"
                    onChange={(e) => setStudyTime(Number(e.target.value))}
                  />
                  <span>25 mins</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="study-time"
                    value="50"
                    onChange={(e) => setStudyTime(Number(e.target.value))}
                  />
                  <span>50 mins</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="study-time"
                    value="75"
                    onChange={(e) => setStudyTime(Number(e.target.value))}
                  />
                  <span>75 mins</span>
                </label>
              </div>
            </form>

            <form>
              <p>Amount to break per cycle</p>
              <div className="radio-container">
                <label>
                  <input
                    type="radio"
                    name="break-time"
                    value="5"
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                  />
                  <span>5 mins</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="break-time"
                    value="10"
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                  />
                  <span>10 mins</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="break-time"
                    value="15"
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                  />
                  <span>15 mins</span>
                </label>
              </div>
            </form>

            <button
              type="button"
              onClick={() => {
                if (studyTime && breakTime) {
                  setReady(true);
                } else {
                  alert("Please select both study and break times!");
                }
              }}
            >
              Start Timer
            </button>
          </>
        ) : (
          <div>
            <p>Timer Started!</p>
            <p>
              Study for {studyTime} minutes, then take a {breakTime} minute
              break.
            </p>
            <p>
              {mode === "study" ? "Study" : "Break"} time remaining:{" "}
              {mode === "study"
                ? formatTime(studyTime * 60 - timeElapsed)
                : formatTime(breakTime * 60 - timeElapsed)}
            </p>
          </div>
        )}
        <button className="arrow" onClick={() => navigate("/flashcards")}>
          <svg
            fill="#000000"
            viewBox="0 0 24 24"
            id="right-arrow-circle"
            data-name="Flat Color"
            xmlns="http://www.w3.org/2000/svg"
            className="icon flat-color"
            width={120}
            height={120}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <circle
                id="primary"
                cx="12"
                cy="12"
                r="10"
                style={{ fill: "#000000" }}
              ></circle>
              <path
                id="secondary"
                d="M17.62,11.31,14.5,9.17a1,1,0,0,0-1.5.69V11H7a1,1,0,0,0,0,2h6v1.14a1,1,0,0,0,1.5.69l3.12-2.14A.82.82,0,0,0,17.62,11.31Z"
                style={{ fill: "#2ca9bc" }}
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

function Flashcards() {
  const [addFlashcard, setAddFlashcard] = useState(false);
  const [playFlashcards, setPlayFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAddSubmit = () => {
    if (question !== "" && answer !== "") {
      setFlashcards([...flashcards, [question, answer]]);
      setAddFlashcard(false);
      setAnswer("");
      setQuestion("");
    } else {
      alert("Please fill out both question and answer fields!");
    }
  };

  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }

  const handleGettingFlashcard = () => {
    if (flashcards.length === 0) {
      alert("Please add flashcards before playing!");
      return;
    }
    let index = getRandomIndex(flashcards);
    let question = flashcards[index][0];
    let answer = flashcards[index][1];
    setFlashcards(flashcards.filter((_, i) => i !== index));
    setCurrentFlashcard([question, answer]);
    setShowAnswer(false);
  };

  return (
    <div id="background" className="flashcardsbg">
      <button
        id="add"
        className="actions"
        onClick={() => setAddFlashcard(!addFlashcard)}
      >
        +
      </button>
      <button
        id="start"
        className="actions"
        onClick={() => {
          setPlayFlashcards(!playFlashcards);
          handleGettingFlashcard();
        }}
      >
        ▶
      </button>
      {addFlashcard && (
        <div className="modal">
          <button id="cross" onClick={() => setAddFlashcard(!addFlashcard)}>
            x
          </button>
          <p style={{ marginTop: "25px" }}>Create your flashcard!</p>
          <div style={{ marginTop: "30px" }}>
            <div className="form">
              <p>Question</p>
              <input
                type="text"
                name="question"
                id="question"
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="form">
              <p>&nbsp;&nbsp;Answer</p>
              <input
                type="text"
                name="answer"
                id="answer"
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubmit();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      {playFlashcards && currentFlashcard && (
        <div
          className="modal"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              color: "black",
              position: "fixed",
              marginBottom: "350px",
              marginRight: "380px",
              fontSize: "30px",
            }}
            onClick={() => setPlayFlashcards(!playFlashcards)}
          >
            x
          </button>
          <div>
            <p>Question: {currentFlashcard[0]}</p>
            {showAnswer && <p>Answer: {currentFlashcard[1]}</p>}
            <button
              onClick={() => {
                if (showAnswer) {
                  handleGettingFlashcard();
                } else {
                  setShowAnswer(true);
                }
              }}
            >
              {showAnswer ? "Next" : "Show Answer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
