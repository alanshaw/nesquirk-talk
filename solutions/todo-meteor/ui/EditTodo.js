import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import Todos from '../api/todos/todos'

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
    todo: PropTypes.object,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool
  }

  onEdit = (todoId, data) => {
    Meteor.call('todos.update', { todoId, ...data }, (err) => {
      if (err) return console.error('Failed to edit todo', err)
      this.props.history.push('/')
    })
  }

  onCancel = () => this.props.history.push('/')

  render () {
    const { onEdit, onCancel } = this
    const { todo, loading } = this.props
    return <EditTodo todo={todo} onEdit={onEdit} onCancel={onCancel} loading={loading} />
  }
}

export default withRouter(createContainer(function ({ match }) {
  const handle = Meteor.subscribe('todo', { todoId: match.params.todoId })

  return {
    todo: Todos.findOne({ _id: match.params.todoId }),
    loading: !handle.ready()
  }
}, EditTodoContainer))
