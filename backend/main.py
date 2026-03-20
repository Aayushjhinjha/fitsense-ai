from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import mediapipe as mp
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - \
              np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

@app.get("/")
def home():
    return {"message": "FitSense AI Backend chal raha hai!"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze-pose")
async def analyze_pose(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    BaseOptions = mp.tasks.BaseOptions
    PoseLandmarker = mp.tasks.vision.PoseLandmarker
    PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
    VisionRunningMode = mp.tasks.vision.RunningMode

    options = PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path='pose_landmarker.task'),
        running_mode=VisionRunningMode.IMAGE
    )

    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

    with PoseLandmarker.create_from_options(options) as landmarker:
        result = landmarker.detect(mp_image)

    if not result.pose_landmarks or len(result.pose_landmarks) == 0:
        return {
            "detected": False,
            "feedback": "Body detect nahi hui — poora body camera mein dikhao"
        }

    landmarks = result.pose_landmarks[0]
    hip   = [landmarks[23].x, landmarks[23].y]
    knee  = [landmarks[25].x, landmarks[25].y]
    ankle = [landmarks[27].x, landmarks[27].y]
    knee_angle = calculate_angle(hip, knee, ankle)

    if knee_angle > 160:
        feedback = "Aur neeche jao — squat deeper karo!"
    elif knee_angle < 70:
        feedback = "Bahut neeche ho — thoda upar aao"
    else:
        feedback = "Perfect squat form! Shabaash!"

    return {
        "detected": True,
        "knee_angle": round(knee_angle, 2),
        "feedback": feedback
    }

@app.post("/workout-plan")
async def workout_plan(data: dict):
    name = data.get("name", "User")
    goal = data.get("goal", "Muscle Gain")
    level = data.get("level", "Beginner")
    weight = data.get("weight", 70)

    prompt = f"""You are an expert fitness trainer. Create a workout plan for today.
User: {name}, Goal: {goal}, Level: {level}, Weight: {weight}kg
Return ONLY valid JSON, no extra text:
{{"day":"Push Day","exercises":[{{"name":"Bench Press","sets":3,"reps":"8-10","rest":"60 sec","tip":"Keep back flat"}}],"duration":"45 minutes","calories":"300-400 kcal"}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        plan = json.loads(text)
    except:
        plan = {
            "day": "Push Day",
            "exercises": [
                {"name": "Bench Press", "sets": 3, "reps": "8-10", "rest": "60 sec", "tip": "Keep back flat"},
                {"name": "Push Ups", "sets": 3, "reps": "12-15", "rest": "45 sec", "tip": "Full range of motion"},
                {"name": "Shoulder Press", "sets": 3, "reps": "10-12", "rest": "60 sec", "tip": "Control the weight"},
                {"name": "Tricep Dips", "sets": 3, "reps": "12-15", "rest": "45 sec", "tip": "Elbows close to body"}
            ],
            "duration": "45 minutes",
            "calories": "300-400 kcal"
        }
    return plan

@app.post("/diet-plan")
async def diet_plan(data: dict):
    goal = data.get("goal", "Muscle Gain")
    weight = data.get("weight", 70)
    diet = data.get("diet", "Vegetarian")
    level = data.get("level", "Beginner")

    prompt = f"""You are an expert Indian nutritionist. Create a meal plan for today.
Goal: {goal}, Weight: {weight}kg, Diet: {diet}, Level: {level}
Return ONLY valid JSON, no extra text:
{{"calories":"2200 kcal","protein":"120g","meals":[{{"time":"8:00 AM","meal":"Breakfast","food":"4 eggs + 2 roti","calories":"450 kcal"}}]}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        plan = json.loads(text)
    except:
        plan = {
            "calories": "2200 kcal",
            "protein": "120g",
            "meals": [
                {"time": "8:00 AM", "meal": "Breakfast", "food": "4 ande + 2 roti + chai", "calories": "450 kcal"},
                {"time": "1:00 PM", "meal": "Lunch", "food": "Dal chawal + paneer sabzi", "calories": "600 kcal"},
                {"time": "4:00 PM", "meal": "Pre-Workout", "food": "Banana + peanut butter", "calories": "250 kcal"},
                {"time": "8:00 PM", "meal": "Dinner", "food": "Roti + sabzi + curd", "calories": "500 kcal"}
            ]
        }
    return plan