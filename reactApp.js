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

    this.props.dispatch(handleAddGoal(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeItem = (goal) => {
    this.props.dispatch(handleDeleteGoal(goal))
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

class ConnectedGoals extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { goals } = store.getState()

          return <Goals goals={goals} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
    )
  }
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault()

    this.props.dispatch(handleAddTodo(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeItem = (todo) => {
    this.props.dispatch(handleDeleteTodo(todo))
  }

  toggleItem = (todo) => {
    this.props.dispatch(handleTodoToggle(todo.id))
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

class ConnectedTodos extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { todos } = store.getState()

          return <Todos todos={todos} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
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
    const { loading } = store.getState()

    if (loading) {
      return (
        <h3>Loading</h3>
      )
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    )
  }
}

class ConnectedApp extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          return <App store={store} />
        }}
      </Context.Consumer>
    )
  }
}

const Context = React.createContext()

class Provider extends React.Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)