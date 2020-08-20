/**
 * This is an example of store
 * @param {function} reducer pure function to update the state based on action
 */
function createStore(reducer) {

  let state;
  // to listen to the changes
  let listeners = [];

  /**
   * Get current state
   * @returns {Object} current state
   */
  const getState = () => state

  /**
   * Add list of listeners.
   * @param {function} callback function to be called when state is changed
   * @returns {function} unsubscribe function to remove the listener
   */
  const subscribe = (callback) => {
    listeners.push(callback)

    return () => listeners.filter(listener => listener !== callback)
  }

  /**
   * Update state when action is performed and invoke the listeners
   * @param {Object} action
   */
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

// App code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}


/**
 * Pure function to update the state of todos based on action.
 * @param {array} state current state
 * @param {Object} action action performed
 */
const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])

    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id)

    case TOGGLE_TODO:
      return state.map(todo => todo.id === action.id
        ? Object.assign({}, todo, { completed: !todo.completed })
        : todo
      )

    default:
      return state
  }
}

/**
 * Pure function to update the state of goals based on action.
 * @param {array} state current state
 * @param {Object} action action performed
 */
const goals = (state = [], action) => {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])

    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id)

    default:
      return state
  }
}

// root reducer
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  }
}

// Use of store
const store = createStore(app)

const unsubscribe = store.subscribe(() => {
  const { todos, goals } = store.getState()

  document.getElementById('todos').innerHTML = ''
  document.getElementById('goals').innerHTML = ''

  todos.forEach(todo => displayTodo(todo))
  goals.forEach(goal => displayGoal(goal))
})

function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

function addTodo() {
  let input = document.getElementById('todo')
  let name = input.value
  input.value = ''

  store.dispatch(addTodoAction({
    id: generateId(),
    name,
    completed: false
  }))
}

function addGoal() {
  let input = document.getElementById('goal')
  let name = input.value
  input.value = ''

  store.dispatch(addGoalAction({
    id: generateId(),
    name,
    completed: false
  }))
}

function createRemoveButton(callback) {
  const button = document.createElement('button')
  button.innerHTML = 'X'

  button.addEventListener('click', callback)
  return button
}

function displayTodo(todo) {
  const listItem = document.createElement('li')
  const text = document.createTextNode(todo.name)
  listItem.style.textDecoration = todo.completed ? 'line-through' : 'none'

  listItem.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id))
  })

  const btn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id))
  })

  listItem.appendChild(text)
  listItem.appendChild(btn)
  document.getElementById('todos')
    .appendChild(listItem)
}


function displayGoal(goal) {
  const listItem = document.createElement('li')
  const text = document.createTextNode(goal.name)

  const btn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id))
  })

  listItem.appendChild(text)
  listItem.appendChild(btn)
  document.getElementById('goals')
    .appendChild(listItem)
}



document.getElementById('todoBtn')
  .addEventListener('click', () => addTodo())

document.getElementById('goalBtn')
  .addEventListener('click', () => addGoal())