import { Mongo } from 'meteor/mongo'

const Todos = new Mongo.Collection('todos')

Todos.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
})

export default Todos
