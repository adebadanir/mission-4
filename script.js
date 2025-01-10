const currentTimeElement = document.getElementById("current-time");
const inputBox = document.getElementById("input-box");
const prioritySelect = document.getElementById("priority");
const submitButton = document.getElementById("submit-task");
const listContainer = document.getElementById("tasks-list-container");
const doneListContainer = document.getElementById("done-list-container");
const overdueListContainer = document.getElementById("overdue-list-container");
const overdueSimulationCheck = document.getElementById("overdue-simulation");

function updateCurrentTime() {
  const now = new Date();
  if (overdueSimulationCheck.value === "yes") {
    now.setDate(now.getDate() + 1);
  }
  const formattedTime = `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  currentTimeElement.innerHTML = `<strong>Date Time:</strong> ${formattedTime}`;
}

function createCheckBox() {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "checkbox";
  checkBox.style.marginRight = "10px";
  return checkBox;
}

function createTaskText(task) {
  const taskText = document.createElement("span");
  taskText.innerHTML = `&nbsp; -&nbsp; ${task}`;
  taskText.classList.add("task-text");
  return taskText;
}

function createPriorityText(priority) {
  const priorityText = document.createElement("span");
  priorityText.innerHTML = `&nbsp; -&nbsp; ${priority}`;
  return priorityText;
}

function createTimeText(timeNow) {
  const timeText = document.createElement("span");
  timeText.id = "time-text";
  timeText.innerHTML = `&nbsp${timeNow}`;
  return timeText;
}

function moveTaskToDone(taskItem) {
  doneListContainer.appendChild(taskItem);
  saveData();
}

function moveTaskToTodo(taskItem) {
  listContainer.appendChild(taskItem);

  saveData();
}

function moveTaskToOverdue(container, taskItem) {
  container.removeChild(taskItem);
  overdueListContainer.appendChild(taskItem);
}

function addTask() {
  const task = inputBox.value;
  const priority = prioritySelect.value;
  const timeNow = new Date().toLocaleDateString();
  console.log(`input value:${[task, priority, timeNow]}`);

  if (task === "") {
    alert("Task cannot be empty");
    return;
  }

  let li = document.createElement("li");
  let checkBox = createCheckBox();
  let taskText = createTaskText(task);
  let priorityText = createPriorityText(priority);
  let timeText = createTimeText(timeNow);

  li.appendChild(checkBox);
  li.appendChild(timeText);
  li.appendChild(priorityText);
  li.appendChild(taskText);
  li.classList.add("task-item");
  listContainer.appendChild(li);
  checkBox.addEventListener("change", function () {
    handleCheckboxChange(checkBox, li);
  });

  inputBox.value = "";
  prioritySelect.value = "low";
  saveData();
}

function handleCheckboxChange(checkBox, taskItem) {
  if (checkBox.checked) {
    taskItem.style.textDecoration = "line-through";
    moveTaskToDone(taskItem, checkBox);
  } else {
    taskItem.style.textDecoration = "none";
    moveTaskToTodo(taskItem, checkBox);
  }
}

function deleteAllTasks() {
  listContainer.innerHTML = "";
  doneListContainer.innerHTML = "";
  overdueListContainer.innerHTML = "";
  saveData();
}
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
  localStorage.setItem("done", doneListContainer.innerHTML);
  localStorage.setItem("overdue", overdueListContainer.innerHTML);
}
function formatDateToISO(dateString) {
  const isoDate = new Date(dateString).toISOString();
  return isoDate;
}
function setToMidnight(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0); // Set waktu ke 00:00:00
  return newDate;
}
function loadData() {
  listContainer.innerHTML = localStorage.getItem("data");
  doneListContainer.innerHTML = localStorage.getItem("done");
  overdueListContainer.innerHTML = localStorage.getItem("overdue");

  const allCheckboxes = document.querySelectorAll(".checkbox");
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const taskItem = checkbox.closest("li");
      handleCheckboxChange(checkbox, taskItem);
    });
  });

  // Membuat checkbox di doneListContainer menjadi tercentang
  const doneCheckboxes = doneListContainer.querySelectorAll(".checkbox");
  doneCheckboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  const itemss = listContainer.querySelectorAll("li");
  itemss.forEach((taskItem) => {
    const timeTextElement = taskItem.querySelector("#time-text");
    if (timeTextElement) {
      const timeString = timeTextElement.innerHTML
        .replace(/&nbsp;/g, "")
        .replace("-", "")
        .trim();
      const [month, day, year] = timeString.split("/");

      let increment = 0;
      if (overdueSimulationCheck.value === "yes") {
        increment = 1;
      }

      const taskDate = `${year}/${month}/${Number(day) + increment}`;
      const fomattedTaskDate = setToMidnight(formatDateToISO(taskDate));
      const formatedNow = setToMidnight(new Date());
      if (fomattedTaskDate > formatedNow) {
        const taskAlreadyInOverdue = Array.from(
          overdueListContainer.querySelectorAll("li")
        ).some((item) => item.innerHTML === taskItem.innerHTML);

        if (!taskAlreadyInOverdue) {
          moveTaskToOverdue(listContainer, taskItem);
        }
      } else {
        return;
      }
    }
  });
}

loadData();
setInterval(updateCurrentTime, 1000);
updateCurrentTime();
