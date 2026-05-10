# Smart Living Ecosystem Platform

An AI-powered urban relocation decision support system that helps professionals find the perfect neighborhood when moving to a new city.

## Features
- **Multi-City Coverage** — Pune, Bengaluru, Hyderabad, Chennai, Mumbai (28 neighborhoods)
- **AI-Powered Analysis** — Groq + Gemini dual-AI architecture for fast, intelligent recommendations
- **Financial Planning** — Salary, EMI, savings goals modeled into livable monthly plans
- **Daily Routine Simulation** — Minute-by-minute day mapping with stress indicators
- **NLP Review Insights** — Resident reviews analyzed for safety, noise, food quality
- **Booking & Savings Tracker** — Book accommodation, gym, restaurants with real-time savings calculation
- **Restaurant Discovery** — Find nearby dining options with ratings and reviews

## Tech Stack
- **Frontend:** React + TypeScript + Vite + Framer Motion + Recharts
- **Backend:** FastAPI + Python
- **AI:** Groq SDK + Google Gemini + NLP Engine
- **Database:** MongoDB Atlas (with local JSON fallback)
- **Maps:** Google Maps + Places API

## Run Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
