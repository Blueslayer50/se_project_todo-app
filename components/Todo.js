class Todo {
  constructor(data, selector, { handleToggle, handleDelete }) {
    this.data = data;
    this.selector = selector;

    this._handleToggle = handleToggle;
    this._handleDelete = handleDelete;

    this.element = null;
    this.nameEl = null;
    this.dateEl = null;
    this.checkboxEl = null;
    this.labelEl = null;
    this.deleteBtn = null;
  }

  _setEventListeners() {
    if (this.deleteBtn) {
      this.deleteBtn.addEventListener("click", () => {
        const wasCompleted = this.checkboxEl.checked;
        this._handleDelete(wasCompleted); // notify counter
        this._deleteTodo();
      });
    }

    if (this.checkboxEl) {
      this.checkboxEl.addEventListener("change", (evt) => {
        const isCompleted = evt.target.checked;
        this._toggleComplete(isCompleted);
        this._handleToggle(isCompleted); // notify counter
      });
    }
  }

  _deleteTodo() {
    this.element.remove();
  }

  _toggleComplete(isCompleted) {
    if (isCompleted) {
      this.element.classList.add("todo_completed");
    } else {
      this.element.classList.remove("todo_completed");
    }
  }

  _formatDueDate() {
    if (!this.data.date) return "";

    if (this.data.date instanceof Date) {
      return this.data.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return "";
  }

  getView() {
    const template = document.querySelector(this.selector);
    if (!template) {
      throw new Error(`Template with selector "${this.selector}" not found`);
    }

    const clone = template.content.cloneNode(true);
    const todoElement = clone.querySelector(".todo");
    if (!todoElement) {
      throw new Error(`No element with class "todo" in template`);
    }

    this.element = todoElement;

    this.nameEl = this.element.querySelector(".todo__name");
    this.dateEl = this.element.querySelector(".todo__date");
    this.checkboxEl = this.element.querySelector(".todo__completed");
    this.labelEl = this.element.querySelector(".todo__label");
    this.deleteBtn = this.element.querySelector(".todo__delete-btn");

    if (this.nameEl) {
      this.nameEl.textContent = this.data.name ?? "";
    }

    if (this.dateEl) {
      this.dateEl.textContent = this._formatDueDate();
    }

    if (this.checkboxEl) {
      this.checkboxEl.checked = !!this.data.completed;

      const uniqueId = `todo-${crypto.randomUUID()}`;
      this.checkboxEl.id = uniqueId;

      if (this.labelEl) {
        this.labelEl.setAttribute("for", uniqueId);
      }
    }

    this._setEventListeners();
    return this.element;
  }
}

export default Todo;
