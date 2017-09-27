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
