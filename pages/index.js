import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/ToDo.js";
import FormValidator from "../components/FormValidator.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");
const counterText = document.querySelector(".counter__text");
const addTodoForm = document.querySelector("#add-todo-form");

const openModal = (modal) => modal.classList.add("popup_visible");
const closeModal = (modal) => modal.classList.remove("popup_visible");

function updateCounter() {
  const allItems = todosList.querySelectorAll(".todo");
  const completedItems = todosList.querySelectorAll(".todo_completed");
  counterText.textContent = `Showing ${completedItems.length} out of ${allItems.length} completed`;
}

function generateTodo(data) {
  const todo = new Todo(data, "#todo-template");
  const todoElement = todo.getView();

  todoElement.addEventListener("change", () => updateCounter());
  todoElement.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("todo__delete-btn")) {
      setTimeout(updateCounter, 0);
    }
  });

  return todoElement;
}

addTodoButton.addEventListener("click", () => openModal(addTodoPopup));
addTodoCloseBtn.addEventListener("click", () => closeModal(addTodoPopup));

addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = evt.target.name.value.trim();
  if (!name) return;

  const dateInput = evt.target.date.value;
  const date = dateInput ? new Date(dateInput) : null;

  const values = {
    name,
    date,
    completed: false,
  };

  const todoElement = generateTodo(values);
  todosList.append(todoElement);

  closeModal(addTodoPopup);

  formValidator.resetValidation();
  updateCounter();
});

// Load initial todos
initialTodos.forEach((item) => {
  const date = item.date ? new Date(item.date) : null;

  const todoElement = generateTodo({
    ...item,
    date,
  });

  todosList.append(todoElement);
});

updateCounter();

const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();
formValidator.resetValidation();
