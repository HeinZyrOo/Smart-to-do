import os
from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

'''
app2.py



System flow:
Frontend → Flask backend → Firebase Firestore

Frontend does NOT connect to Firebase directly.
Frontend sends requests to Flask.
Flask saves, reads, updates, and deletes data in Firebase.
'''

# Create Flask server
app = Flask(__name__)

# Allow frontend to access this backend
CORS(app)

# Connect Flask backend to Firebase
# serviceAccountKey.json must be inside the backend folder
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Create Firestore database object
db = firestore.client()


# ==============================
# Gemini AI setup
# ==============================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


# Home route
@app.route("/")
def home():
    return "Flask backend with Firebase is running!"


# Get all tasks from Firebase
@app.route("/tasks", methods=["GET"]) # read all tasks
def get_tasks():
    tasks = []

    # Get all documents from "tasks" collection
    docs = db.collection("tasks").stream()

    for doc_item in docs:
        task = doc_item.to_dict()

        # Add Firebase document ID to task data
        task["id"] = doc_item.id

        tasks.append(task)

    return jsonify(tasks)


# Add new task to Firebase
@app.route("/tasks", methods=["POST"])#create new task
def add_task():
    data = request.json

    # Data received from frontend
    task = {
        "title": data.get("title"),
        "description": data.get("description"),
        "date": data.get("date"),
        "startTime": data.get("startTime"),
        "endTime": data.get("endTime"),
        "priority": data.get("priority"),
        "completed": False
    }

    # Save task to Firebase
    doc_ref = db.collection("tasks").add(task)

    # Return saved task with Firebase document ID
    return jsonify({
        "id": doc_ref[1].id,
        **task
    })


# Update task complete / incomplete status
@app.route("/tasks/<id>", methods=["PUT"])#Update a task's completed status
def update_task(id):
    data = request.json

    # Update only completed field
    db.collection("tasks").document(id).update({
        "completed": data.get("completed")
    })

    return jsonify({"message": "Task updated"})


# Delete task from Firebase
@app.route("/tasks/<id>", methods=["DELETE"])
def delete_task(id):
    db.collection("tasks").document(id).delete()

    return jsonify({"message": "Task deleted"})

# Generate AI productivity suggestions using Gemini
@app.route("/ai-suggestions", methods=["POST"])#call Gemini AI 
def ai_suggestions():
    data = request.json

    # Get task list from frontend
    tasks = data.get("tasks", [])
    date  = data.get("date", "today")

    # If there are no tasks, return a simple message
    if not tasks:
        return jsonify({
            "suggestion": "No tasks found. Please add some tasks first."
        })

    # Prompt sent to Gemini AI
    prompt = f"""
    You are an AI productivity coach for university students.

    Today's date is {data.get("date", "today")}.

    The student has {len(tasks)} upcoming task(s), including today and future schedules.

    Analyze the following tasks and give short, practical advice for today only.

    Focus on:
    1. Show today date and how many task there are
    2. First, analyze today's tasks and explain which task should be done first and why
    3. Then, analyze future tasks and suggest how the student should prepare for them early
    4. Explain how to split the day based on the start and end times
    5. Identify the highest priority task that needs the most attention
    6. Give simple tips to stay focused and avoid burnout today

    Today's tasks:
    {tasks}

    Rules for your response:
    - Prioritize today's tasks before future tasks
    - If there are too many tasks on one day, suggest splitting the workload
    - Mention task names directly so the student knows exactly what you mean
    - Keep advice short and clear, 3 to 5 short paragraphs
    - break each paragraph so student can read clean and easy
    - If all tasks are already completed, congratulate the student
    - If there are high priority tasks, warn the student to handle them early
    - Use simple English, no complex words
    """


    try:
        # Send prompt to Gemini
        response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
        )

        # Return Gemini's answer to frontend
        return jsonify({
            "suggestion": response.text
        })

    except Exception as e:
        # Error message if Gemini API fails
        return jsonify({
            "suggestion": "AI suggestion failed. Please check your Gemini API key or internet connection.",
            "error": str(e)
        }), 500

# Run Flask server
if __name__ == "__main__":
    app.run(debug=True)

'''
REST API design pattern
Frontend (HTML/JS)
↓
Send request (GET:show me tasks / POST:add task / DELETE:remove task / PUT:update task)
↓
Flask backend(app.py) receives request
↓
Process data
↓
Save / read / update / delete data in Firebase
↓
Return JSON:Data format between frontend and backend
↓
Frontend updates UI
'''


'''
1. User fills form → clicks "Add Task"
2. app.js: addTask() reads form values
3. app.js: fetch POST → http://127.0.0.1:5000/tasks
4. app.py: add_task() receives JSON data
5. app.py: saves to Firebase Firestore
6. app.js: loadTasks() → fetch GET → /tasks
7. app.py: get_tasks() reads all from Firebase
8. app.js: renders tasks on the page

9. User clicks "Generate AI Advice"
10. app.js: sends all tasks → /ai-suggestions
11. app.py: builds prompt, calls Gemini API
12. Gemini returns text advice
13. app.js: displays advice in suggestions box
'''