const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const analyzeRoutes =
  require("./routes/analyze");

const chatRoutes =
  require("./routes/chat");
  
const queryRoute =
  require("./routes/query");

const instagramRoute =
  require(
    "./routes/instagram"
  );


const instagramAnalyzeRoute =
  require(
    "./routes/instagramAnalyze"
  );


  const compareRoute =
  require(
    "./routes/compare"
  );

  const compareChatRoute =
  require("./routes/compare-chat");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/analyze", analyzeRoutes);
app.use("/chat", chatRoutes);

app.use(
  "/query",
  queryRoute
);

app.use(
  "/instagram",
  instagramRoute
);

app.use(
  "/instagram-analyze",
  instagramAnalyzeRoute
);

app.use(
  "/compare",
  compareRoute
);

app.use(
  "/compare-chat",
  compareChatRoute
);

app.get("/test-ai", async (req, res) => {
  try {
    const result = await model.generateContent(
      "Say hello to Thejaswini"
    );

    const response = result.response.text();

    res.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});