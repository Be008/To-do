//DarkMode
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const iconToggle = () => {
  moon.classList.toggle("display-none");
  sun.classList.toggle("display-none");
};

const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    sun.classList.add("display-none");
    return;
  }
  moon.classList.add("display-none");
};

const themeSwitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
  iconToggle();
};

moon.addEventListener("click", themeSwitch);
sun.addEventListener("click", themeSwitch);

themeCheck();

//Date
let objectDate = new Date();
let date = document.getElementById("date");

let day = objectDate.getDate();
let month = objectDate.getMonth() + 1;
let year = objectDate.getFullYear();

date.innerHTML = `${day}/${month}/${year}`;

//Box
const box = document.getElementById("box");

function openBox() {
  box.style.display = "flex";
}

function closeBox() {
  box.style.display = "none";
  document.querySelector("input").value = "";
}

//Press "Enter" for add a task
document.getElementById("task").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    add();
  }
});

//Add task to localstorage list
const ul = document.querySelector("ul");
var localList = [];

function add() {
  const taskText = document.getElementById("task").value;
  if (localList.length > 9) {
    Swal.fire("Oops", "limit of 10 tasks reached!");
  } else if (taskText.length < 1) {
    Swal.fire("Oops", "Add some characters!");
  } else {
    localList.push({
      item: taskText,
      status: "",
    });
    document.querySelector("input").value = "";
    updateList();
  }
}

//Update localstorage list
function updateList() {
  localStorage.setItem("todolist", JSON.stringify(localList));
  loadItens();
}

//Load localstorage items on screen
function loadItens() {
  ul.innerHTML = "";
  localList = JSON.parse(localStorage.getItem("todolist")) ?? [];
  localList.forEach((item, i) => {
    addItemScreen(item.item, item.status, i);
  });
}

//Add items on screen
function addItemScreen(taskText, status, i) {
  const li = document.createElement("li");

  li.innerHTML = `
  <div class="flex justify-center w-screen pb-2 text-base dark:text-ivory sm:text-lg md:text-xl">
    <div class="w-1/2">
        <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" class="h-4 w-4"/>
        <label class="font-medium decoration-red" data-si="${i}">${taskText}</label>
    </div>
    <div>
        <button class="text-red hover:animate-pulse" onclick="remove(${i})" data-i=${i}><i class="fa-solid fa-x"></i></button>
    </div>
  </div>
    `;
  ul.appendChild(li);

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add("line-through");
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove("line-through");
  }

  taskText.value = "";
}

//Status check
function done(chk, i) {
  if (chk.checked) {
    localList[i].status = "checked";
  } else {
    localList[i].status = "";
  }

  updateList();
}

//Remove task
function remove(i) {
  localList.splice(i, 1);
  updateList();
}

loadItens();
