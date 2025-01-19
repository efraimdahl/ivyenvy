import "./App.css";
import React, { useState } from "react";
import Quiz from "./components/Quiz.jsx";
// require('dotenv').config();


function App() {
  const [file, setFile] = useState(null); // Image preview URL
  const [plantData, setPlantData] = useState(null); // Plant identification result
  const [loading, setLoading] = useState(false); // Loading state
  const [quizData, setQuizData] = useState(null); // Quiz data

  const plantIdApiUrl = "https://plant.id/api/v3/identification";
  const plantIdApiKey = "n7Aqs2wfNPIZaaolNPdBbCe6agi3ortf8qMPfLIFPlIZZQJd6M"; // Securely load from environment variables

  //const nebiusApiKey = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMDUyMjE1NDMzMDAxMjk0NTQ4OCIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTg5NDk2MjE1NywidXVpZCI6IjJjMzQyZGE3LTc0NTItNDI3MC04ZTNiLWU0MzFlNDM4MzBhYSIsIm5hbWUiOiJJdnlFbnZ5IiwiZXhwaXJlc19hdCI6IjIwMzAtMDEtMThUMTA6MjI6MzcrMDAwMCJ9.qMo7kcdkIULjYhMIYgdOG0s4qrqYHHlXKHY6MrUZx_8";
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

    // Access the classification and suggestions
    const suggestions = data.result?.classification?.suggestions;

    if (suggestions && suggestions.length > 0) {
      const topSuggestion = suggestions[0]; // Take the top suggestion
      const plantName = topSuggestion.name || "Unknown plant";
      const probability = (topSuggestion.probability * 100).toFixed(2); // Convert to percentage
      const description = `This plant is most likely a ${plantName} with a probability of ${probability}%.`;

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

//   // Generate a quiz question using Nebius API
// async function generateQuiz(plantName) {
//   try {
//     // Define the prompt
//     const prompt = `Can you generate a question for ${plantName} using the following format:
//     {
//       question: \`insert question here\`,
//       answers: [
//         "A", // first answer
//         "B", // second answer
//         "C", // third answer
//       ].sort(() => Math.random() - 0.5), // Shuffle answers
//       correctIndex: 0, // Index of the correct answer before shuffle
//     } Please copy everything exactly between {} and change everything between "".`;

//     // Make the API call
//     const completion = await client.chat.completions.create({
//       model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.6,
//     });

//     // Parse the response
//     const quizData = JSON.parse(completion.choices[0].message.content);
//     console.log('Generated Quiz Data:', quizData);

//     // Update state with the quiz data
//     setQuizData(quizData);
//   } catch (error) {
//     console.error("Error generating quiz with Nebius API:", error);
//     alert("Failed to generate quiz. Please try again.");
//   }
// }


  // Generate a quiz question based on the plant name
  function generateQuiz(plantName) {
    const sampleQuiz = {
        question: "What is the common name for Dracaena fragrans?",
        answers: [
          "Corn Plant",
          "Dragon Tree",
          "Red-Edged Dracaena",
        ].sort(() => Math.random() - 0.5),
        correctIndex: 0,
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
