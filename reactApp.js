function List(props) {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>
          <span
            onClick={() => props.toggleItem && props.toggleItem(item)}
            style={{ textDecoration: item.complete ? 'line-through' : 'none' }}
          >
            {item.name}
          </span>

          <button
            onClick={() => props.removeItem(item)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  )
}

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault()

    API.saveGoal(this.input.value)
      .then((goal) => {
        this.props.store.dispatch(addGoalAction(goal))
        this.input.value = ''
      })
      .catch(() => alert('Error occurred. Try again.'))
  }

  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id))

    API.deleteGoal(goal.id)
      .catch(() => {
        this.props.store.dispatch(addGoalAction(goal))
        alert('Error occurred. Try again.')
      })
  }

  render() {
    const { goals } = this.props

    return (
      <div>
        <h1>Goals List</h1>
        <input
          type="text"
          placeholder="Add Goal"
          ref={(input) => this.input = input}
        />

        <button onClick={(event) => this.addItem(event)}> Add Goal </button>

        <List
          items={goals}
          removeItem={this.removeItem}
        />
      </div>
    )
  }
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault()

    API.saveTodo(this.input.value)
      .then((todo) => {
        this.props.store.dispatch(addTodoAction(todo))
        this.input.value = ''
      })
      .catch(() => alert('Error occurred. Try again.'))
  }

  removeItem = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id))

    API.deleteTodo(todo.id)
      .catch(() => {
        this.props.store.dispatch(addTodoAction(todo))
        alert('Error occurred. Try again.')
      })
  }

  toggleItem = (todo) => {
    this.props.store.dispatch(toggleTodoAction(todo.id))

    API.saveTodoToggle(todo.id)
      .catch(() => {
        this.props.store.dispatch(toggleTodoAction(todo.id))
        alert('Error occurred. Try again.')
      })
  }

  render() {
    const { todos } = this.props

    return (
      <div>
        <h1>Todos List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={input => this.input = input}
        />

        <button onClick={(event) => this.addItem(event)}> Add Todo </button>

        <List
          items={todos}
          removeItem={this.removeItem}
          toggleItem={this.toggleItem}
        />
      </div>
    )
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props

    store.subscribe(() => this.forceUpdate())

    Promise.all([API.fetchGoals(), API.fetchTodos()])
      .then(([goals, todos]) => {
        store.dispatch(receiveData(goals, todos))
      })
  }

  render() {
    const { store } = this.props
    const { todos, goals, loading } = store.getState()

    if (loading) {
      return (
        <h3>Loading</h3>
      )
    }

    return (
      <div>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    )
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('app'))