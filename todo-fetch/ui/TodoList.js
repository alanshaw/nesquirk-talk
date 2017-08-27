import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    onDone: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    loading: PropTypes.bool
  }

  onDoneChange = (e) => {
    const target = e.currentTarget
    this.props.onDone(target.getAttribute('data-id'), target.checked)
  }

  onRemoveClick = (e) => {
    if (!window.confirm('Are you sure?')) return
    this.props.onRemove(e.currentTarget.getAttribute('data-id'))
  }

  render () {
    const { todos, loading } = this.props
    return (
      <div>
        <div className='row mt-3 mb-2'>
          <div className='col-6'>
            <h1>TODO list</h1>
          </div>
          <div className='col-6 text-right'>
            <Link to='/add' className='btn btn-primary'>Add todo</Link>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <List todos={todos} onDoneChange={this.onDoneChange} onRemoveClick={this.onRemoveClick} />
        )}
      </div>
    )
  }
}

const List = ({ todos, onDoneChange, onRemoveClick }) => todos.length ? (
  <ol className='list-group'>
    {todos.map((todo) => (
      <li key={todo._id} className={`list-group-item justify-content-between ${todo.done ? 'list-group-item-success' : ''}`}>
        <div>
          <label className='p-1 mr-2 mb-0' title={todo.done ? 'Not done?' : 'Done?'}>
            <input type='checkbox' checked={!!todo.done} onChange={onDoneChange} data-id={todo._id} />
          </label>
          <Link to={`/view/${todo._id}`}>{todo.title || 'Untitled'}</Link>
        </div>
        <div>
          <Link to={`/edit/${todo._id}`} className='btn btn-secondary btn-sm mr-2'>Edit</Link>
          <button type='button' className='btn btn-danger btn-sm' onClick={onRemoveClick} aria-label='Remove' data-id={todo._id}>
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
      </li>
    ))}
  </ol>
) : (
  <p>No todos yet!</p>
)

class TodoListContainer extends Component {
  state = { todos: [], loading: true }

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

  render () {
    const { todos, loading } = this.state
    const { onDone, onRemove } = this
    return <TodoList todos={todos} onDone={onDone} onRemove={onRemove} laoding={loading} />
  }
}

export default TodoListContainer
