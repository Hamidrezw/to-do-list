const form = document.getElementById("form");
const input = document.getElementById("input");
const todosList = document.getElementById("todos");

const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

const isTouchDevice =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

const updateLocalStorage = () => {
  const wrappers = document.querySelectorAll("#todos > div");
  const todos = [];

  wrappers.forEach((wrapper) => {
    const li = wrapper.querySelector("li");

    todos.push({
      text: li.innerText,
      completed: li.classList.contains("line-through"),
    });
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodo = (wrapper) => {
  wrapper.classList.add("opacity-0", "transition", "duration-200");

  setTimeout(() => {
    wrapper.remove();
    updateLocalStorage();
  }, 200);
};

const addTodo = (todo) => {
  let todoText = input.value;
  if (todo) todoText = todo.text;
  if (!todoText.trim()) return;

  const wrapper = document.createElement("div");
  wrapper.className =
    "bg-[#1a1e23] border-b border-[#43454d] overflow-hidden";

  const todoElement = document.createElement("li");
  todoElement.className =
    "px-6 py-4 text-lg cursor-pointer transition duration-300 touch-pan-y";

  if (todo && todo.completed) {
    todoElement.classList.add("line-through");
  }

  todoElement.innerText = todoText;

  wrapper.appendChild(todoElement);
  todosList.appendChild(wrapper);

  // Toggle
  todoElement.addEventListener("click", () => {
    todoElement.classList.toggle("line-through");
    updateLocalStorage();
  });

  // Desktop right click
  if (!isTouchDevice) {
    wrapper.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      removeTodo(wrapper);
    });
  }

  // Mobile swipe
  if (isTouchDevice) {
    let startX = 0;
    let currentX = 0;

    wrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    wrapper.addEventListener("touchmove", (e) => {
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;

      if (diffX < 0) {
        wrapper.style.transform = `translateX(${diffX}px)`;
        wrapper.style.opacity = 1 + diffX / 200;
      }
    });

    wrapper.addEventListener("touchend", () => {
      const diffX = currentX - startX;

      if (diffX < -80) {
        removeTodo(wrapper);
      } else {
        wrapper.style.transition = "transform 0.2s ease";
        wrapper.style.transform = "translateX(0)";
        wrapper.style.opacity = "1";

        setTimeout(() => {
          wrapper.style.transition = "";
        }, 200);
      }
    });
  }

  input.value = "";
  updateLocalStorage();
};

savedTodos.forEach((todo) => addTodo(todo));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});