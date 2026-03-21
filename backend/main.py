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
@app.post("/count-rep")
async def count_rep(file: UploadFile = File(...), exercise: str = "squat"):
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
        return {"detected": False, "stage": "", "feedback": "Body detect nahi hui"}

    landmarks = result.pose_landmarks[0]

    if exercise == "squat":
        hip   = [landmarks[23].x, landmarks[23].y]
        knee  = [landmarks[25].x, landmarks[25].y]
        ankle = [landmarks[27].x, landmarks[27].y]
        angle = calculate_angle(hip, knee, ankle)
        stage = "down" if angle < 120 else "up"
        feedback = f"Knee angle: {round(angle, 1)}° — {'Squat depth achha hai!' if angle < 120 else 'Neeche jao'}"

    elif exercise == "pushup":
        shoulder = [landmarks[11].x, landmarks[11].y]
        elbow    = [landmarks[13].x, landmarks[13].y]
        wrist    = [landmarks[15].x, landmarks[15].y]
        angle = calculate_angle(shoulder, elbow, wrist)
        stage = "down" if angle < 90 else "up"
        feedback = f"Elbow angle: {round(angle, 1)}° — {'Good depth!' if angle < 90 else 'Neeche jao'}"

    elif exercise == "curl":
        shoulder = [landmarks[11].x, landmarks[11].y]
        elbow    = [landmarks[13].x, landmarks[13].y]
        wrist    = [landmarks[15].x, landmarks[15].y]
        angle = calculate_angle(shoulder, elbow, wrist)
        stage = "up" if angle < 50 else "down"
        feedback = f"Curl angle: {round(angle, 1)}° — {'Full curl!' if angle < 50 else 'Curl karo'}"

    else:
        stage = "up"
        feedback = "Exercise detect ho rahi hai"

    return {
        "detected": True,
        "stage": stage,
        "angle": round(angle, 1),
        "feedback": feedback
    }
@app.post("/sales-agent")
async def sales_agent(data: dict):
    message = data.get("message", "")
    history = data.get("history", [])

    system_prompt = """You are a friendly AI sales agent for FitSense AI gym. 
Your job is to help potential members join the gym and answer questions.

Gym Details:
- Monthly Plan: Rs. 1500/month
- Quarterly Plan: Rs. 3500 (save Rs. 1000)
- Half Yearly: Rs. 6000 (save Rs. 3000)  
- Annual Plan: Rs. 10000 (save Rs. 8000)
- Timing: 5 AM to 11 PM, 7 days a week
- Facilities: Weights, Cardio, Yoga, Personal Training, Locker Room
- Free trial: 1 day free trial available
- Location: Available on request

Rules:
1. Always be friendly and helpful
2. Respond in the same language as the user (Hindi or English)
3. If user seems interested, ask for their name and phone number
4. Keep responses short and conversational
5. If user gives name and phone, say lead has been captured and owner will call
6. Use emojis occasionally to be friendly

If user provides their name AND phone number, include "LEAD_CAPTURED" at the end of your response."""

    messages_list = [{"role": "system", "content": system_prompt}]
    for h in history[-10:]:
        messages_list.append({"role": h["role"], "content": h["content"]})
    messages_list.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_list,
            max_tokens=300
        )
        reply = response.choices[0].message.content.strip()
        lead_captured = "LEAD_CAPTURED" in reply
        reply = reply.replace("LEAD_CAPTURED", "").strip()
    except:
        reply = "Sorry, abhi AI service unavailable hai. Please thodi der baad try karo."
        lead_captured = False

    return {
        "reply": reply,
        "lead_captured": lead_captured
    }