let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!taskInput) {
    alert("Please enter a task description.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskInput,
    due: dueDate,
    priority,
    completed: false,
    createdAt: new Date().toLocaleString()
  };

  tasks.push(task);
  saveTasks();

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function renderTasks() {
  const pending = document.getElementById("pendingTasks");
  const completed = document.getElementById("completedTasks");

  pending.innerHTML = "";
  completed.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(`priority-${task.priority}`);

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        ${task.due ? `📅 ${task.due}` : ""} 
        <span style="color: gray; font-size: 0.9em;">${task.createdAt}</span>
      </div>
      <div class="task-actions">
        ${!task.completed ? `<button onclick="markDone(${task.id})"><i class="fas fa-check"></i></button>` : ""}
        <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;

    (task.completed ? completed : pending).appendChild(li);
  });
}

function markDone(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: true } : task
  );
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  const newText = prompt("Update the task:", task.text);
  if (newText && newText.trim() !== "") {
    tasks = tasks.map(t =>
      t.id === id ? { ...t, text: newText.trim() } : t
    );
    saveTasks();
  }
}

function clearCompleted() {
  if (confirm("Clear all completed tasks?")) {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
  }
}

function clearPending() {
  if (confirm("Clear all pending tasks?")) {
    tasks = tasks.filter(task => task.completed);
    saveTasks();
  }
}

function searchTasks() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll("li").forEach(li => {
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(query) ? "flex" : "none";
  });
}

renderTasks();
