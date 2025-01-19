require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(bodyParser.json()); // Parse JSON payloads

// Route to handle Nebius API requests
app.post("/api/generateQuiz", async (req, res) => {
  const { plantName } = req.body;

  try {
    const response = await axios.post(
      "https://api.studio.nebius.ai/v1/chat/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        temperature: 0.6,
        messages: [
          {
            role: "user",
            content: `Can you generate a question for ${plantName}?`,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEBIUS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data); // Send Nebius API response back to the client
  } catch (error) {
    console.error("Error calling Nebius API:", error.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
