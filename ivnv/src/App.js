import './App.css';
import React, { useState } from "react";
import Quiz from "./components/Quiz.jsx"
function App() {
  const [file, setFile] = useState();


  const kindwise_api = process.env.KINDWISEAPI;
  
  console.log(kindwise_api)
  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  }

  const sampleQuiz = {
    question: "What is the capital of France?",
    answers: ["Paris", "Berlin", "Rome"],
    correctIndex: 0,
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ivy Envy</h1>
        <div className="image-upload-container">
          <label htmlFor="file-input" className="upload-placeholder">
            {file ? (
              <img src={file} alt="Uploaded preview" className="uploaded-image" />
            ) : (
              <p>Click to upload an image</p>
            )}
          </label>
          <input
            type="file"
            id="file-input"
            onChange={handleChange}
            accept="image/*"
            className="file-input"
          />
          <Quiz questionData={sampleQuiz} />
        </div>
      </header>
    </div>
  );
}

export default App;
