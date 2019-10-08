const todoList = document.querySelector('#todoList');
const todoFilterBtn = document.querySelector('#todoFilterBtn');

const state = {
  todos: [
    { id: 0, title: 'First todo', complete: false },
    { id: 1, title: 'Second todo', complete: true },
    { id: 2, title: 'Third todo', complete: false }
  ],
  hideComplete: false
};

const deleteTodo = (id) => {
  // return a function that once again captures id of todos in closure
  // then deletes todo from state
  return () => {
    state.todos = state.todos.filter(t => t.id !== id);

    renderTodoList(state.hideComplete);
  };
};

const toggleTodoComplete = (id) => {
  // return a function that captures the id this function was bound to in a closure
  // an use it to toggle that todo's complete property
  return () => {
    state.todos = state.todos.map(t => {
      if (t.id === id) {
        return { ...t, complete: !t.complete };
      }
      return t;
    });

    renderTodoList(state.hideComplete);
  };
};

const renderFilterBtnText = () => {
  const viewTitle = state.hideComplete ? 'Show Completed' : 'Hide Completed';
  todoFilterBtn.textContent = viewTitle;
};

const toggleViewFilter = () => {
  state.hideComplete = !state.hideComplete;
  renderTodoList(state.hideComplete);
};
todoFilterBtn.addEventListener('click', toggleViewFilter);

const createDeleteBtn = (clickHandler) => {
  const span = document.createElement('span');
  span.classList = 'action__delete';
  span.onclick = clickHandler;
  span.textContent = 'X';

  return span;
};

const createTodoItem = (id, title, complete) => {
  // create list item element and add todo title
  const li = document.createElement('li');
  li.textContent = title;

  // figure out if todo has been completed and add class
  const isComplete = complete;
  const classNames = isComplete ? 'todo--complete' : '';
  li.classList = classNames;

  // add click handler
  li.onclick = toggleTodoComplete(id);

  // add delete button if todo is incomplete
  if (!complete) {
    const deleteBtn = createDeleteBtn(deleteTodo(id));
    li.appendChild(deleteBtn);
  }

  // return the list item element
  return li;
};

const renderTodoList = (hideComplete) => {
  // empty todo list's list item elements
  todoList.innerHTML = '';

  // filter todos based on hideComplete parameter
  const filteredTodos = hideComplete
    ? state.todos.filter(t => !t.complete)
    : state.todos;

  // iterate over state and create list items
  const todos = filteredTodos.map(t => createTodoItem(t.id, t.title, t.complete));

  // iterate over todo nodes and append to todo list
  todos.forEach(t => todoList.appendChild(t));

  // update filter button text
  renderFilterBtnText();

  // log a message to the console
  // console.log('todo list rendered!');
};

renderTodoList(state.hideComplete);
