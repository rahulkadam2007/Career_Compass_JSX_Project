const path = require("path");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Force dotenv to load .env from the exact directory of this server.js file
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "exam_portal",
  waitForConnections: true,
  connectionLimit: 10,
});

// AI Configuration & Provider Detection
const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const isOpenRouter = Boolean(apiKey?.startsWith("sk-or-"));

const aiClient = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
    })
  : null;

// Startup Diagnostics
console.log("=========================================");
console.log("Career Compass Server Initializing...");
console.log("Target .env location:", envPath);
console.log("AI API Key Loaded:   ", Boolean(apiKey));
console.log("Provider:            ", isOpenRouter ? "OpenRouter" : "OpenAI");
console.log("=========================================");

// ---------------- API Routes ----------------

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      server: true,
      database: true,
      aiConfigured: Boolean(aiClient),
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      server: true,
      database: false,
      aiConfigured: Boolean(aiClient),
      message: e.message,
    });
  }
});

// User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Full name, email, and password are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email address." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must contain at least 6 characters." });
    }

    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email=? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    if (exists.length) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    const [r] = await pool.query(
      "INSERT INTO users(fullname, email, password) VALUES(?, ?, ?)",
      [fullname.trim(), email.trim().toLowerCase(), password]
    );
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      userId: r.insertId,
    });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const [rows] = await pool.query(
      "SELECT id, fullname, email, created_at FROM users WHERE email=? AND password=? LIMIT 1",
      [email.trim().toLowerCase(), password]
    );
    if (!rows.length) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    res.json({ success: true, message: "Login successful.", user: rows[0] });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    res.status(500).json({ success: false, message: "Login failed." });
  }
});

// Utility to clean Markdown wrapper tags from AI response
function clean(t) {
  return t
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// Generate Quiz via AI
app.post("/api/generate-quiz", async (req, res) => {
  try {
    if (!aiClient) {
      return res.status(500).json({
        success: false,
        message:
          "AI API key is missing. Add OPENROUTER_API_KEY or OPENAI_API_KEY to server/.env.",
      });
    }

    const defaultModel = isOpenRouter
      ? "openai/gpt-4o-mini"
      : "gpt-4o-mini";
    const model =
      process.env.AI_MODEL || process.env.OPENAI_MODEL || defaultModel;

    console.log("Generating AI quiz using model:", model);

    const completion = await aiClient.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            'You are a career assessment quiz generator. Return ONLY valid JSON without markdown wrapping. Generate exactly 20 multiple-choice questions. Every question must have exactly 4 options. correctAnswer must be integer 0, 1, 2, or 3. category must be one of: Technology, Business, Design, Science, Communication, Management, Finance, Healthcare, General. Format: {"questions":[{"question":"string","options":["A","B","C","D"],"correctAnswer":0,"category":"Technology"}]}',
        },
        {
          role: "user",
          content: "Generate the 20-question career assessment now.",
        },
      ],
      max_tokens: Number(process.env.MAX_TOKENS || 4000),
    });

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) throw new Error("AI returned an empty response.");

    const quiz = JSON.parse(clean(raw));

    if (!Array.isArray(quiz.questions) || quiz.questions.length < 18) {
      throw new Error(
        `AI returned only ${quiz.questions?.length || 0} questions.`
      );
    }

    // Safely take up to 20 questions
    const finalQuestions = quiz.questions.slice(0, 20);

    const isValid = finalQuestions.every(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(Number(q.correctAnswer)) &&
        Number(q.correctAnswer) >= 0 &&
        Number(q.correctAnswer) <= 3
    );

    if (!isValid) {
      throw new Error("AI returned an invalid question schema.");
    }

    res.json({ success: true, questions: finalQuestions });
  } catch (e) {
    console.error("GENERATE QUIZ ERROR:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Unable to generate AI quiz.",
    });
  }
});

// Save Quiz Results
app.post("/api/quiz-result", async (req, res) => {
  try {
    const { userId, score, total, answers, categories } = req.body;
    if (!userId || score === undefined || !total) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete quiz result." });
    }

    await pool.query(
      "INSERT INTO quiz_log(user_id, score, total_questions, answers_json, categories_json) VALUES(?, ?, ?, ?, ?)",
      [
        userId,
        Number(score),
        Number(total),
        JSON.stringify(answers || {}),
        JSON.stringify(categories || {}),
      ]
    );

    res.json({ success: true, message: "Quiz result saved." });
  } catch (e) {
    console.error("SAVE RESULT ERROR:", e);
    res.status(500).json({ success: false, message: "Could not save quiz result." });
  }
});

// Fetch Results by User
app.get("/api/results/:userId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM quiz_log WHERE user_id=? ORDER BY quiz_id DESC",
      [req.params.userId]
    );
    res.json({ success: true, results: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: "Could not fetch results." });
  }
});

// Fetch Career Paths
app.get("/api/careers", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM career_path ORDER BY career_id"
    );
    res.json({ success: true, careers: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: "Could not fetch career paths." });
  }
});

app.listen(PORT, () => {
  console.log(`Career Compass server running at http://localhost:${PORT}`);
});