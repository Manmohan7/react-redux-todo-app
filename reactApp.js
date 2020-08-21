function List(props) {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>
          <span
            onClick={() => props.toggleItem && props.toggleItem(item)}
            style={{textDecoration: item.completed ? 'line-through' : 'none'}}
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

    const name = this.input.value
    this.input.value = ''

    this.props.store.dispatch(addGoalAction({
      id: generateId(),
      name
    }))
  }

  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id))
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

    const name = this.input.value
    this.input.value = ''

    this.props.store.dispatch(addTodoAction({
      id: generateId(),
      name,
      completed: false
    }))
  }

  removeItem = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id))
  }

  toggleItem = (todo) => {
    this.props.store.dispatch(toggleTodoAction(todo.id))
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
  }

  render() {
    const { store } = this.props
    const { todos, goals } = store.getState()


    return (
      <div>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    )
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('app'))