import { Meteor } from 'meteor/meteor'
import Todos from '../todos'

Meteor.publish('todos', () => {
  return Todos.find({}, { fields: { _id: 1, title: 1, createdAt: 1, done: 1 } })
})

Meteor.publish('todo', ({ todoId }) => {
  return Todos.find({ _id: todoId })
})
