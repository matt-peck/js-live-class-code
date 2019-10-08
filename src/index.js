const todoList = document.querySelector('#todoList');
const todoFilterBtn = document.querySelector('#todoFilterBtn');
const addTodoInput = document.querySelector('#addTodoInput');

const state = {
  todos: [
    { id: 0, title: 'First todo', complete: false },
    { id: 1, title: 'Second todo', complete: true },
    { id: 2, title: 'Third todo', complete: false }
  ],
  hideComplete: false,
  editingTodoId: null
};

const deleteTodo = (id) => {
  return () => {
    state.todos = state.todos.filter(t => t.id !== id);
    renderTodoList();
  };
};

const toggleTodoEditing = (id) => {
  state.editingTodoId = id;
  renderTodoList();
};

const updateTodoItem = (id, title) => {
  state.todos = state.todos.map(t => {
    if (t.id === id) {
      return {
        ...t,
        title
      };
    }
    return t;
  });
  renderTodoList();
};

const toggleTodoComplete = (id) => {
  state.todos = state.todos.map(t => {
    if (t.id === id) {
      return {
        ...t,
        complete: !t.complete
      };
    }
    return t;
  });

  renderTodoList();
};

const renderFilterBtnText = () => {
  const viewTitle = state.hideComplete ? 'Show Completed' : 'Hide Completed';
  todoFilterBtn.textContent = viewTitle;
};

const toggleViewFilter = () => {
  state.hideComplete = !state.hideComplete;
  renderTodoList();
};
todoFilterBtn.addEventListener('click', toggleViewFilter);

const createDeleteBtn = (clickHandler) => {
  const span = document.createElement('span');
  span.classList = 'action__delete';
  span.onclick = clickHandler;
  span.textContent = 'X';

  return span;
};

const createTodoItem = ({ id, title, complete }) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = title;

  const li = document.createElement('li');

  const todoTitle = document.createElement('span');
  todoTitle.textContent = title;

  const completeBtn = document.createElement('input');
  completeBtn.type = 'checkbox';
  completeBtn.checked = complete;
  completeBtn.classList = 'action__complete';

  // figure out if todo has been completed and add class
  const isComplete = complete;
  const classNames = isComplete ? 'todo--complete' : '';
  li.classList = classNames;

  // add event handlers
  // li.onclick = toggleTodoComplete(id);
  todoTitle.onclick = () => toggleTodoEditing(id);
  completeBtn.onclick = () => toggleTodoComplete(id);
  input.onchange = () => updateTodoItem(id, input.value);
  input.onblur = () => toggleTodoEditing(null);
  input.onkeypress = (e) => {
    if (e.keyCode === 13) {
      toggleTodoEditing(null);
    }
  };

  // add complete checkbox
  li.appendChild(completeBtn);

  // add text span
  li.appendChild(todoTitle);

  // add delete button if todo is incomplete
  if (!complete) {
    const deleteBtn = createDeleteBtn(deleteTodo(id));
    li.appendChild(deleteBtn);
  }

  // return the right type of element based on editing mode
  const element = state.editingTodoId === id ? input : li;
  return element;
};

const renderTodoList = () => {
  // empty todo list's list item elements
  todoList.innerHTML = '';

  // filter todos based on hideComplete parameter
  const filteredTodos = state.hideComplete
    ? state.todos.filter(t => !t.complete)
    : state.todos;

  // iterate over state and create list items
  // iterate over todo nodes and append to todo list
  filteredTodos.forEach(t => {
    const element = createTodoItem(t);
    todoList.appendChild(element)

    // focus on the input
    if (state.editingTodoId === t.id) {
      element.focus();
    }
  });

  // update filter button text
  renderFilterBtnText();

  // log a message to the console
  // console.log('todo list rendered!');
};

const addTodo = (value) => {
  state.todos.push({
    id: state.todos.length,
    title: value,
    complete: false
  });
  addTodoInput.value = '';
  renderTodoList();
};

const handleAddTodo = (e) => {
  if (e.keyCode === 13 && e.target.value.trim()) {
    addTodo(e.target.value);
  }
};
addTodoInput.addEventListener('keypress', handleAddTodo);

renderTodoList();
