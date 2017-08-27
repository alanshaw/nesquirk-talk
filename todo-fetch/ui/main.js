import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import TodoList from './TodoList'
import AddTodo from './AddTodo'
import EditTodo from './EditTodo'
import ViewTodo from './ViewTodo'

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
