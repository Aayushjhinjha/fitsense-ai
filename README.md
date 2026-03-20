# FitSense AI 🏋️

India's First AI-Powered Gym Coach & Management Platform

## 🚀 Live Features

- **AI Squat Form Checker** — Real-time pose detection using MediaPipe. Camera se squat form check karo, knee angle calculate hota hai, instant feedback milta hai
- **AI Workout Plan** — Groq/Llama 3.3 se personalized daily workout plan. Goal aur level ke hisaab se automatically generate hota hai
- **AI Indian Diet Plan** — Roz naya Indian meal plan. Veg/Non-veg, goal, weight ke hisaab se personalized
- **User Onboarding** — Name, age, weight, height, goal, level, diet preference setup

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| AI Pose Detection | MediaPipe Pose Landmarker |
| AI Plans | Groq API — Llama 3.3 70B |
| Styling | Inline CSS |

## 📁 Project Structure
```
fitsense-ai/
├── frontend/          # React app — localhost:3000
│   └── src/
│       ├── App.js     # Main dashboard
│       └── Onboarding.js  # User setup
└── backend/           # FastAPI — localhost:8000
    └── main.py        # API endpoints
```

## 🔌 API Endpoints

- `GET /health` — Server health check
- `POST /analyze-pose` — MediaPipe pose analysis
- `POST /workout-plan` — AI workout plan generation
- `POST /diet-plan` — AI Indian diet plan generation

## ⚙️ Setup & Run

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn mediapipe opencv-python groq python-dotenv python-multipart
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🎯 Roadmap

- [x] AI Squat Form Checker
- [x] AI Workout Plan Generator
- [x] AI Indian Diet Plan
- [x] User Onboarding
- [ ] Rep Counter
- [ ] QR Code Entry
- [ ] Face Recognition Entry
- [ ] In-app Payments (Razorpay)
- [ ] AI Sales Agent Chatbot
- [ ] Gym Owner Dashboard

## 👨‍💻 Developer

Built by Aayush Jhinjhal — [GitHub](https://github.com/Aayushjhinjha)