# Career Compass – JSX Version

React/JSX frontend + Node.js/Express backend + MySQL + OpenAI/OpenRouter.

## Setup
1. Install Node.js.
2. Run `npm install`.
3. Create MySQL database by running `database/exam_portal.sql`.
4. Copy `server/.env.example` to `server/.env`.
5. Enter your MySQL password and AI API key.
6. Run `npm run dev`.
7. Open http://localhost:5173

Backend health check: http://localhost:3000/api/health

Note: JSX is used for the React frontend. Node/Express backend remains JavaScript.
For a real deployment, hash passwords with bcrypt/argon2 instead of plain text.
