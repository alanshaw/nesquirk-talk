import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class EditTodo extends Component {
  static propTypes = {
    todo: PropTypes.object,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = props.todo ? { ...props.todo } : {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.todo) {
      this.setState({ ...nextProps.todo })
    }
  }

  onChange = (e) => {
    const name = e.target.getAttribute('name')
    this.setState({ [name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { title, description } = this.state
    if (!title && !description) return

    this.props.onEdit(this.props.todo._id, { title, description })
  }

  onCancelClick = () => this.props.onCancel()

  render () {
    const { loading } = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <h1 className='my-3'>Edit TODO</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input className='form-control' name='title' onChange={this.onChange} value={this.state.title} />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea className='form-control' name='description' onChange={this.onChange} value={this.state.description} />
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-success mr-1'>Edit</button>
              <button type='button' className='btn btn-link' onClick={this.onCancelClick}>Cancel</button>
            </div>
          </div>
        )}
      </form>
    )
  }
}

class EditTodoContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = { todo: null, loading: true }

  componentWillMount () {
    window.fetch(`/todo/${this.props.match.params.todoId}`, {
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
    .then((todo) => this.setState({ todo, loading: false }))
    .catch((err) => console.error('Failed to fetch todo', err))
  }

  onEdit = (todoId, data) => {
    window.fetch(`/todo/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
      this.props.history.push('/')
    })
    .catch((err) => console.error('Failed to edit todo', err))
  }

  onCancel = () => this.props.history.push('/')

  render () {
    const { onEdit, onCancel } = this
    const { todo, loading } = this.state
    return <EditTodo todo={todo} onEdit={onEdit} onCancel={onCancel} loading={loading} />
  }
}

export default withRouter(EditTodoContainer)
