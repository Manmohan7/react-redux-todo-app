// App code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'
const RECEIVE_DATA = 'RECEIVE_DATA'

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

function receiveData(goals, todos) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  }
}

function handleAddTodo(name, callback) {
  return (dispatch) => {

    return API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo))
        callback()
      })
      .catch(() => alert('Error occurred Try again.'))
  }
}

function handleDeleteTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id))

    return API.deleteTodo(todo.id)
      .catch(() => {
        dispatch(addTodoAction(todo))
        alert('Error Occurred. Try again')
      })
  }
}

function handleTodoToggle(id) {
  return (dispatch) => {
    dispatch(toggleTodoAction(id))

    return API.saveTodoToggle(id)
      .catch(() => {
        dispatch(toggleTodoAction(id))
        alert('Error occurred. Try again')
      })
  }
}

// We are not using optimistic approach here
const handleAddGoal = (name, callback) => (dispatch) => {
  API.saveGoal(name)
    .then((goal) => {
      dispatch(addGoalAction(goal))
      callback()
    })
    .catch(() => alert('Error occurred. Try again'))
}

// We are using optimistic approach here
const handleDeleteGoal = (goal) => (dispatch) => {
  dispatch(removeGoalAction(goal.id))

  return API.deleteGoal(goal.id)
    .catch(() => {
      dispatch(addGoalAction(goal))
      alert('Error occurred. Try again')
    })
}

const handleInitialData = () => (dispatch) => {
  return Promise.all([
    API.fetchGoals(),
    API.fetchTodos()
  ])
    .then(([goals, todos]) => {
      dispatch(receiveData(goals, todos))
    })
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
        ? Object.assign({}, todo, { complete: !todo.complete })
        : todo
      )

    case RECEIVE_DATA:
      return action.todos

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

    case RECEIVE_DATA:
      return action.goals

    default:
      return state
  }
}

const loading = (state = true, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return false

    default:
      return state
  }
}

const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope. That's a bad idea.")
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert("Nope. That's a bad idea.")
  }

  return next(action)
}

const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('The action: ', action)
  const result = next(action)
  console.log('The new state: ', store.getState())
  console.groupEnd()
  return result
}

// Use of store
const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals,
  loading,
}), Redux.applyMiddleware(ReduxThunk.default, checker, logger))

function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
