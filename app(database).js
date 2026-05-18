import { db } from "./firebase.js";

import {
  collection,
 addDoc,
 getDocs,
 updateDoc,
 deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let tasks = [];  //part is used to store app data.
let currentFilter = "all"; 
const tasksCollection = collection(db, "tasks");

const taskForm = document.getElementById("taskForm");  //the form where user writes a task
const taskList = document.getElementById("taskList");  //the area where all tasks are shown
const todaySchedule = document.getElementById("todaySchedule");//the area for today’s schedule
const suggestions = document.getElementById("suggestions");//the area for smart advice/messages
const taskCount = document.getElementById("taskCount");//shows how many tasks are displayed
const filterButtons = document.querySelectorAll(".filter-btn");//gets all filter buttons like All / Completed / High

// Form submit event
taskForm.addEventListener("submit", async function (e) {  //part makes the form work when the user clicks Submit.
  e.preventDefault();
  await addTask();
});


// Filter button events
filterButtons.forEach((button) => {   //controls the task filtering system; Remove Add Change Call
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

// Add a new task from the form
async function addTask() {     //Reads the values entered by the user;Tile Name,Info
  const title = document.getElementById("title").value.trim();  
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const priority = document.getElementById("priority").value;

  if (!title || !date || !startTime || !endTime) {
    alert("Please fill in all required fields.");
    return;
  }

  if (startTime >= endTime) {
    alert("End time must be later than start time.");
    return;
  }

  const newTask = {   //Creates one task as an object.
    title: title,
    description: description,
    date: date,
    startTime: startTime,
    endTime: endTime,
    priority: priority,
    completed: false,
  };

  await addDoc(tasksCollection, newTask);

  taskForm.reset();
  await loadTasks();
}

//Load tasks from Firebase
async function loadTasks() {
  tasks = [];

  const querySnapshot = await getDocs(tasksCollection);

  querySnapshot.forEach((docSnap) => {
    tasks.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  // Sort tasks by date and time  earlier tasks come first.
  tasks.sort((a, b) => {
    const first = `${a.date} ${a.startTime}`;
    const second = `${b.date} ${b.startTime}`;
    return first.localeCompare(second);
  });

  renderAll();
}

// Render everything
function renderAll() {
  renderTasks();  //update task list
  renderTodaySchedule(); //update today schedule
  renderSuggestions(); //update advice/messages
}

// Return filtered tasks
function getFilteredTasks() {  //decides which tasks should be shown
  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (currentFilter === "incomplete") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "high") {
    return tasks.filter((task) => task.priority === "High");
  }

  if (currentFilter === "Medium") {
    return tasks.filter((task) => task.priority === "Medium");
  }

  if (currentFilter === "Low") {
    return tasks.filter((task) => task.priority === "Low");
  }

  return tasks;
}

// Render task list
function renderTasks() {
  const filteredTasks = getFilteredTasks();  //Gets only the tasks that match the selected filter.

  taskList.innerHTML = "";  //Removes the old task list before drawing the new one.

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<p class="empty-message">No tasks found for this filter.</p>`;
  } else {
    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = `task-item ${task.completed ? "completed-task" : ""}`; //completed, also add completed-task

      taskItem.innerHTML = ` 
        <div class="task-top">
          <div>
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-description">${escapeHtml(task.description || "No description")}</div>
          </div>
        </div>

        <div class="task-meta">
          <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
          <span class="badge ${task.completed ? "status-completed" : "status-incomplete"}">
            ${task.completed ? "Completed" : "Incomplete"}
          </span>
          <span class="badge">${task.date}</span>
          <span class="badge">${task.startTime} - ${task.endTime}</span>
        </div>

        <div class="task-actions">
          <button class="btn btn-small btn-complete" onclick="toggleComplete('${task.id}')">
            ${task.completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
          <button class="btn btn-small btn-delete" onclick="deleteTask('${task.id}')">  
            Delete
          </button>
        </div>
      `;// mark complete, uncomplete, delete Action

      taskList.appendChild(taskItem); //Add task item to page
    });
  }

  taskCount.textContent = `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""}`; //Update task counter
}

// Render today schedule
function renderTodaySchedule() {
  todaySchedule.innerHTML = ""; //Clear old schedule

  const today = getTodayString(); //get today sche

  const todayTasks = tasks.filter((task) => task.date === today); //Find today’s tasks

  if (todayTasks.length === 0) {       //If no tasks today
    todaySchedule.innerHTML = `<p class="empty-message">No tasks scheduled for today.</p>`;
    return;
  }

  todayTasks.forEach((task) => {    //Show each today task
    const scheduleItem = document.createElement("div");
    scheduleItem.className = "schedule-item";

    scheduleItem.innerHTML = `
      <div class="schedule-time">${task.startTime} - ${task.endTime}</div>
      <div><strong>${escapeHtml(task.title)}</strong></div>
      <div>${task.priority} Priority</div>
    `; //show title,priority

    todaySchedule.appendChild(scheduleItem);  //add
  });
}

// Render smart suggestions
function renderSuggestions() {
  suggestions.innerHTML = "";  //Clear old suggestions

  const today = getTodayString();  //Prepare task groups
  const todayTasks = tasks.filter((task) => task.date === today);
  const unfinishedTasks = tasks.filter((task) => !task.completed);
  const highPriorityToday = todayTasks.filter((task) => task.priority === "High");
  const completedToday = todayTasks.filter((task) => task.completed);

  const messages = [];

  if (todayTasks.length === 0) {
    messages.push("You have free time today. This is a good chance to plan ahead.");
  }

  if (todayTasks.length > 3) {
    messages.push("You have a busy day today. Try to focus on the most important tasks first.");
  }

  if (highPriorityToday.length >= 2) {
    messages.push("You have multiple high-priority tasks today. Try starting with the hardest one.");
  }

  if (unfinishedTasks.length >= 5) {
    messages.push("You have many unfinished tasks. Consider completing older tasks before adding new ones.");
  }

  if (todayTasks.length > 0 && completedToday.length === todayTasks.length) {
    messages.push("Great job. You completed all of today’s tasks.");
  }

  if (messages.length === 0) {
    messages.push("Your schedule looks balanced today. Keep going.");
  }

  messages.forEach((message) => {  //Turns each message into a visible suggestion box
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.textContent = message;
    suggestions.appendChild(suggestionItem);
  });
}

// Toggle task completion
async function toggleComplete(id) {        //Marks a task as complete or incomplete.
  const task = tasks.find((task) => task.id === id);
  if (!task) return;

  const taskRef = doc(db, "tasks", id);

  await updateDoc(taskRef, {
    completed: !task.completed
  });

  await loadTasks();
}

// Delete task
async function deleteTask(id) {
  const taskRef = doc(db, "tasks", id);
  await deleteDoc(taskRef);
  await loadTasks();
}

// Get today's date as YYYY-MM-DD
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Return CSS class for priority badge
function getPriorityClass(priority) {      //used for colored priority badges.
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

// Prevent HTML injection in task text
function escapeHtml(text) {   //Protects the app from HTML injection / unsafe text.
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initial render
renderAll();

window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;
loadTasks();

//User adds task
//↓
//Task is saved to Firebase
//↓
//App loads tasks from Firebase
//↓
//Tasks appear on screen