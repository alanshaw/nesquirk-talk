import { Meteor } from 'meteor/meteor'
import _ from 'lodash'
import Todos from './todos'

Meteor.methods({
  'todos.add' (payload) {
    const data = Object.assign(
      _.pick(payload, ['title', 'description']),
      { done: false, createdAt: new Date() }
    )
    Todos.insert(data)
  },

  'todos.update' (payload) {
    const { todoId } = payload
    const data = _.pick(payload, ['title', 'description', 'done'])
    Todos.update({ _id: todoId }, { $set: data })
  }
})
