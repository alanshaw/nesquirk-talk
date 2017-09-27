import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class ViewTodo extends Component {
  static propTypes = {
    todo: PropTypes.object,
    onEdit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    loading: PropTypes.bool
  }

  onEditClick = () => this.props.onEdit(this.props.todo._id)
  onBackClick = () => this.props.onBack()

  render () {
    const { loading, todo } = this.props

    if (loading) {
      return (
        <div>
          <div className='my-3'>
            <h1 className='mb-0 d-inline-block'>Loading...</h1>
          </div>
          <div>
            <button type='button' className='btn btn-link' onClick={this.onBackClick}>Back</button>
          </div>
        </div>
      )
    }

    if (!todo) return null

    const { title, description, done, createdAt } = todo

    return (
      <div>
        <div className='my-3'>
          <h1 className='mb-0 d-inline-block align-middle mr-2'>{title || 'Untitled'}</h1>
          {done ? <span className='badge badge-success align-middle'>Done</span> : null}
        </div>
        <p className='text-muted'>{createdAt.toString()}</p>
        {description ? <p>{description}</p> : null}
        <div>
          <button type='button' className='btn btn-secondary mr-2' onClick={this.onEditClick}>Edit</button>
          <button type='button' className='btn btn-link' onClick={this.onBackClick}>Back</button>
        </div>
      </div>
    )
  }
}

class ViewTodoContainer extends Component {
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

  onEdit = (todoId) => this.props.history.push(`/edit/${todoId}`)
  onBack = () => this.props.history.push('/')

  render () {
    const { todo, loading } = this.state
    return <ViewTodo todo={todo} onBack={this.onBack} loading={loading} />
  }
}

export default withRouter(ViewTodoContainer)
