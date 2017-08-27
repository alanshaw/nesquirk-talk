import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import TodoList from '../../ui/TodoList'
import AddTodo from '../../ui/AddTodo'
import EditTodo from '../../ui/EditTodo'
import ViewTodo from '../../ui/ViewTodo'

ReactDOM.render(
  <Router>
    <div className='container'>
      <Route exact path='/' component={TodoList} />
      <Route exact path='/add' component={AddTodo} />
      <Route exact path='/edit/:todoId' component={EditTodo} />
      <Route exact path='/view/:todoId' component={ViewTodo} />
    </div>
  </Router>,
  document.getElementById('root')
)
