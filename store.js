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

// Use of store
const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals
}))

function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
