const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const filterButtons = document.querySelectorAll("[data-filter]");

const totalEl = document.getElementById("total-tasks");
const completedEl = document.getElementById("completed-tasks");
const pendingEl = document.getElementById("pending-tasks");

const darkToggle = document.getElementById("dark-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed
      ? "flex justify-between items-center line-through opacity-60"
      : "flex justify-between items-center";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "cursor-pointer";
    span.onclick = () => toggleTask(task.id);

    const btn = document.createElement("button");
    btn.textContent = "🗑";
    btn.onclick = () => deleteTask(task.id);

    li.append(span, btn);
    list.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  totalEl.textContent = tasks.length;
  completedEl.textContent = tasks.filter(t => t.completed).length;
  pendingEl.textContent = tasks.filter(t => !t.completed).length;
}

function addTask(text) {
  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  addTask(input.value);
  input.value = "";
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
});

renderTasks();