# Meteor

`cd wip/todo-meteor`

## open `api/todos/server/publications.js`

add:

```js
import { Meteor } from 'meteor/meteor'
import Todos from '../todos'

Meteor.publish('todos', () => {
  // ! Copy from todo-fetch and alter for meteor
  return Todos.find({}, {
    fields: { _id: 1, title: 1, createdAt: 1, done: 1 },
    sort: { createdAt: -1 }
  })
})

Meteor.publish('todo', ({ todoId }) => {
  // ! Copy from todo-fetch and alter for meteor
  return Todos.find({ _id: todoId })
})
```

## open `api/todos/methods.js`

add:

```js
'todos.remove' (payload) {
  // ! Copy from todo-fetch and alter for meteor
  Todos.remove({ _id: payload.todoId })
}
```

## `cp ../../solutions/todo-fetch/ui/TodoList.js imports/ui`

add:

```js
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import Todos from '../api/todos/todos'
```

!!! Instead of fetching todos from our REST endpoint, we're going to subscribe to our todos publication

!!! createContainer takes a function which should return your data
!!! these are passed as props to the component being contained

replace:

```js
export default TodoListContainer
// WITH:
export default createContainer(function (props) {
  const handle = Meteor.subscribe('todos')
  return {
    todos: Todos.find({}, { sort: { createdAt: -1 } }).fetch(),
    loading: !handle.ready()
  }
}, TodoListContainer)
```

remove:

```js
state = { todos: [], loading: true }
```

replace:

```js
const { todos, loading } = this.state
// WITH:
const { todos, loading } = this.props
```

remove:

```js
componentWillMount () {
  this.fetchTodos()
}

fetchTodos () {
  window.fetch('/todos', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    return res.json()
  })
  .then((todos) => this.setState({ todos, loading: false }))
  .catch((err) => console.error('Failed to fetch todos', err))
}
```

replace:

!!! MENTION `this.fetchTodos()`

```js
onDone = (todoId, done) => {
  window.fetch(`/todo/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    this.fetchTodos()
  })
  .catch((err) => console.error('Failed to update todo', err))
}
// WITH:
onDone = (todoId, done) => {
  Meteor.call('todos.update', { todoId, done }, (err) => {
    if (err) return console.error('Failed to update todo', err)
  })
}
```

replace:

```js
onRemove = (todoId) => {
  window.fetch(`/todo/${todoId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    this.fetchTodos()
  })
  .catch((err) => console.error('Failed to remove todo', err))
}
// WITH:
onRemove = (todoId) => {
  Meteor.call('todos.remove', { todoId }, (err) => {
    if (err) return console.error('Failed to remove todo', err)
  })
}
```

# Nesquirk

`cd wip/todo-nesquirk`

## `cp ../../solutions/todo-fetch/server.js .`

add:

```js
const Nesquirk = require('nesquirk')
```

replace:

```js
server.register([Inert], (err) => {
// WITH:
server.register([Inert, Nesquirk], (err) => {
```

add:

```js
server.nq
  .subscription('/todos', (socket, path, params, reply) => {
    db.todos.find({}, { _id: 1, title: 1, createdAt: 1, done: 1 }, reply)
  })
  .subscription('/todo/{todoId}', (socket, path, { todoId }, reply) => {
    db.todos.findOne({ _id: ObjectId(todoId) }, reply)
  })
```

add:

```js
// POST /todo
server.nq.add('/todos', todo)

// PATCH /todo/{todoId}
server.nq
  .update('/todos', todo)
  .update(`/todo/${todoId}`, todo)

// DELETE /todo/{todoId}
server.nq
  .remove('/todos', todoId)
  .remove(`/todo/${todoId}`, todoId)
```

## `cp ../../solutions/todo-fetch/ui/TodoList.js ui`

add:

```js
import { createContainer, withClient } from 'nesquirk'
import Todos from './domain/Todos'
```

replace:

```js
export default TodoListContainer
// WITH:
export default withClient(createContainer(function (props) {
  const handle = this.subscribe('/todos', Todos)
  return {
    todos: Todos.find({}).sort({ createdAt: -1 }).all(),
    loading: !handle.ready()
  }
}, TodoListContainer))
```

remove:

```js
state = { todos: [], loading: true }
```

replace:

```js
const { todos, loading } = this.state
// WITH:
const { todos, loading } = this.props
```

remove:

```js
componentWillMount () {
  this.fetchTodos()
}

fetchTodos () {
  window.fetch('/todos', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    return res.json()
  })
  .then((todos) => this.setState({ todos, loading: false }))
  .catch((err) => console.error('Failed to fetch todos', err))
}
```

replace:

```js
onDone = (todoId, done) => {
  window.fetch(`/todo/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    this.fetchTodos()
  })
  .catch((err) => console.error('Failed to update todo', err))
}
// WITH:
onDone = (todoId, done) => {
  this.props.client.request({
    path: `/todo/${todoId}`,
    method: 'PATCH',
    payload: { done }
  }, (err) => {
    if (err) return console.error('Failed to update todo', err)
  })
}
```

replace:

```js
onRemove = (todoId) => {
  window.fetch(`/todo/${todoId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
    this.fetchTodos()
  })
  .catch((err) => console.error('Failed to remove todo', err))
}
// WITH:
onRemove = (todoId) => {
  this.props.client.request({
    path: `/todo/${todoId}`,
    method: 'DELETE'
  }, (err) => {
    if (err) return console.error('Failed to remove todo', err)
  })
}
```
