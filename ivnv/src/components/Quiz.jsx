import React, { useState } from "react";
//import './Quiz.css'; // Optional: If you have separate CSS for the quiz component.

function Quiz({ questionData }) {
  const { question, answers, correctIndex } = questionData;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  function handleAnswer(index) {
    setSelectedAnswer(index);
    setIsCorrect(index === correctIndex);
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-question">{question}</h2>
      <div className="quiz-answers">
        {answers.map((answer, index) => (
          <button
            key={index}
            className={`quiz-answer ${
              selectedAnswer !== null
                ? index === correctIndex
                  ? "correct"
                  : index === selectedAnswer
                  ? "incorrect"
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            {answer}
          </button>
        ))}
      </div>
      {selectedAnswer !== null && (
        <p className="quiz-feedback">
          {isCorrect ? "Correct! 🎉" : "Incorrect 😞"}
        </p>
      )}
    </div>
  );
}

export default Quiz;
