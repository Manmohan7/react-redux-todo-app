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

    this.props.store.dispatch(handleAddGoal(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeItem = (goal) => {
    this.props.store.dispatch(handleDeleteGoal(goal))
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

    this.props.store.dispatch(handleAddTodo(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeItem = (todo) => {
    this.props.store.dispatch(handleDeleteTodo(todo))
  }

  toggleItem = (todo) => {
    this.props.store.dispatch(handleTodoToggle(todo.id))
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

    store.dispatch(handleInitialData())

    store.subscribe(() => this.forceUpdate())
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