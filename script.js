class Task {
  constructor(name) {
    this.name = name;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}

class TaskManager {
  constructor() {
    this.tasks = this.loadFromLocalStorage();
  }

  addTask(name) {
    const newTask = new Task(name);
    this.tasks.push(newTask);
    this.saveToLocalStorage();
    this.renderTasks();
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
    this.saveToLocalStorage();
    this.renderTasks();
  }

  toggleTask(index) {
    this.tasks[index].toggleCompleted();
    this.saveToLocalStorage();
    this.renderTasks();
  }

  saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    return tasks.map((task) => {
      const newTask = new Task(task.name);
      newTask.completed = task.completed;
      return newTask;
    });
  }

  renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the list

    this.tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
        <span class="${task.completed ? "completed-task" : ""}">${
        task.name
      }</span>
        <button class="delete-btn"><i class="ri-delete-bin-6-line"></i></button>
      `;

      // Add event listener to toggle task completion on li click
      taskItem.addEventListener("click", () => {
        this.toggleTask(index);
      });

      // Prevent the delete button from triggering task toggle
      taskItem
        .querySelector(".delete-btn")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          this.removeTask(index);
        });

      taskList.appendChild(taskItem);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const taskManager = new TaskManager();
  taskManager.renderTasks();

  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = taskInput.value.trim();

    if (taskName !== "") {
      taskManager.addTask(taskName);
      taskInput.value = "";
    }
  });
});
