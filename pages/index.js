import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todozx.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

function generateTodo(data) {
  const todo = new Todo(data, "#todo-template", {
    handleToggle: (isCompleted) => {
      todoCounter.updateCompleted(isCompleted);
    },
    handleDelete: (wasCompleted) => {
      todoCounter.updateTotal(false);
      if (wasCompleted) todoCounter.updateCompleted(false);
    },
  });

  return todo.getView();
}

let todoSection;

todoSection = new Section({
  items: initialTodos.map((item) => ({
    ...item,
    date: item.date ? new Date(item.date) : null,
  })),
  renderer: (item) => {
    const todoElement = generateTodo(item);
    todoSection.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});

todoSection.renderItems();

const addTodoPopup = new PopupWithForm("#add-todo-popup", (formData) => {
  const name = formData.name.trim();
  if (!name) return;

  const date = formData.date ? new Date(formData.date) : null;

  const values = {
    name,
    date,
    completed: false,
  };

  const todoElement = generateTodo(values);
  todoSection.addItem(todoElement);

  todoCounter.updateTotal(true);

  addTodoPopup.close();
});

addTodoPopup.setEventListeners();

const addTodoButton = document.querySelector(".button_action_add");
addTodoButton.addEventListener("click", () => addTodoPopup.open());

const addTodoForm = document.querySelector("#add-todo-form");
const formValidator = new FormValidator(validationConfig, addTodoForm);
formValidator.enableValidation();
formValidator.resetValidation();
