const express = require('express')
const cors = require('cors')

const userRouter = require('./modules/users/user.routes')
const todoRouter = require('./modules/todos/todo.routes')

const PORT = process.env.PORT || 1000

const app = express()

app
  .use(cors())
  .use(express.json())
  .use('/api/todos', todoRouter)
  .use('/api', userRouter)

app.listen(PORT, () => console.log('SERVERS START PORT ' + PORT))



