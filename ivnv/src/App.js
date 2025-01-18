import "./App.css";
import React, { useState } from "react";
import Quiz from "./components/Quiz.jsx";

function App() {
  const [file, setFile] = useState(null); // Image preview URL
  const [plantData, setPlantData] = useState(null); // Plant identification result
  const [loading, setLoading] = useState(false); // Loading state
  const [quizData, setQuizData] = useState(null); // Quiz data

  const plantIdApiUrl = "https://plant.id/api/v3/identification";
  const plantIdApiKey = "n7Aqs2wfNPIZaaolNPdBbCe6agi3ortf8qMPfLIFPlIZZQJd6M"; // Replace with your actual API key

  // Convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64 data
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Handle file selection and preview
  async function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(URL.createObjectURL(uploadedFile)); // Display image preview

      try {
        const base64Image = await fileToBase64(uploadedFile);
        identifyPlant(base64Image); // Call the API
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Failed to process the image. Please try again.");
      }
    }
  }

  // Identify the plant using Plant.id API
  async function identifyPlant(base64Image) {
    setLoading(true);
    setPlantData(null);
    setQuizData(null);

    const payload = {
      images: [base64Image],
      latitude: 49.207, // Optional: Provide coordinates if available
      longitude: 16.608, // Optional: Provide coordinates if available
      similar_images: true,
    };

    try {
      const response = await fetch(plantIdApiUrl, {
        method: "POST",
        headers: {
          "Api-Key": plantIdApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }

      const data = await response.json();
      console.log("Plant.id API Response:", data); // Log the full response for debugging

      const plantInfo = data.suggestions?.[0]; // Extract the top suggestion

      if (plantInfo) {
        const plantName = plantInfo.plant_name;
        const description = plantInfo.plant_details?.wiki_description?.value || "Description not available.";
        setPlantData({ name: plantName, description });
        generateQuiz(plantName); // Generate quiz
      } else {
        alert("No plant identified. Please try another image.");
      }
    } catch (error) {
      console.error("Error identifying plant:", error);
      alert(`Error identifying plant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Generate a quiz question based on the plant name
  function generateQuiz(plantName) {
    const sampleQuiz = {
      question: `What is the name of this plant?`,
      answers: [
        plantName, // Correct answer
        "Rose", // Placeholder incorrect answer
        "Tulip", // Placeholder incorrect answer
      ].sort(() => Math.random() - 0.5), // Shuffle answers
      correctIndex: 0, // Correct index before shuffle
    };

    setQuizData(sampleQuiz);
  }

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
        </div>
        {loading && <p>Identifying plant...</p>}
        {plantData && (
          <div className="plant-info">
            <h2>Plant Identified:</h2>
            <p><strong>Name:</strong> {plantData.name}</p>
            <p><strong>Description:</strong> {plantData.description}</p>
          </div>
        )}
        {quizData && (
          <div className="quiz-container">
            <h2>Take the Quiz!</h2>
            <Quiz questionData={quizData} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
