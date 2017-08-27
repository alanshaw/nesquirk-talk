const Path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const mongojs = require('mongojs')
const { ObjectId } = mongojs
const _ = require('lodash')

const server = new Hapi.Server()
const db = mongojs('todo', ['todos'])

server.connection({ host: 'localhost', port: 3000 })

server.register([Inert], (err) => {
  if (err) throw err

  // Get
  server.route({
    method: 'GET',
    path: '/todos',
    handler (request, reply) {
      db.todos
        .find({}, { _id: 1, title: 1, createdAt: 1, done: 1 })
        .sort({ createdAt: -1 }, reply)
    }
  })

  server.route({
    method: 'GET',
    path: '/todo/{todoId}',
    handler (request, reply) {
      db.todos.findOne(
        { _id: ObjectId(request.params.todoId) },
        { _id: 1, title: 1, createdAt: 1, done: 1 },
        reply
      )
    }
  })

  // Add
  server.route({
    method: 'POST',
    path: '/todo',
    handler (request, reply) {
      const data = Object.assign(
        _.pick(request.payload, ['title', 'description']),
        { done: false, createdAt: new Date() }
      )

      db.todos.insert(data, (err, todo) => {
        if (err) return reply(err)
        reply(todo)
      })
    }
  })

  // Edit
  server.route({
    method: 'PATCH',
    path: '/todo/{todoId}',
    handler (request, reply) {
      const todoId = ObjectId(request.params.todoId)
      const data = _.pick(request.payload, ['title', 'description', 'done'])

      db.todos.update({ _id: todoId }, { $set: data }, (err) => {
        if (err) return reply(err)
        db.todos.findOne({ _id: todoId }, (err, todo) => {
          if (err) return reply(err)
          reply(todo)
        })
      })
    }
  })

  // Remove
  server.route({
    method: 'DELETE',
    path: '/todo/{todoId}',
    handler (request, reply) {
      const todoId = ObjectId(request.params.todoId)

      db.todos.remove({ _id: todoId }, (err) => {
        if (err) return reply(err)
        reply().code(204)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public'),
        redirectToSlash: true,
        index: true
      }
    }
  })

  server.start((err) => {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
})
