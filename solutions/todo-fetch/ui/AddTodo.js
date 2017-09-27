import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withClient } from 'nesquirk'

export class AddTodo extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  state = { title: '', description: '' }

  onChange = (e) => {
    const name = e.target.getAttribute('name')
    this.setState({ [name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { title, description } = this.state
    if (!title && !description) return

    this.props.onAdd({ title, description })
  }

  onCancelClick = () => this.props.onCancel()

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <h1 className='my-3'>Add TODO</h1>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input className='form-control' name='title' onChange={this.onChange} value={this.state.title} />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea className='form-control' name='description' onChange={this.onChange} value={this.state.description} />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-success mr-1'>Add</button>
          <button type='button' className='btn btn-link' onClick={this.onCancelClick}>Cancel</button>
        </div>
      </form>
    )
  }
}

class AddTodoContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  onAdd = (data) => {
    window.fetch('/todo', {
      method: 'POST',
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
    .catch((err) => console.error('Failed to add todo', err))
  }

  onCancel = () => this.props.history.push('/')

  render () {
    return <AddTodo onAdd={this.onAdd} onCancel={this.onCancel} />
  }
}

export default withRouter(withClient(AddTodoContainer))
