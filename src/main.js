const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const userRouter = require('./modules/users/user.routes')
const todoRouter = require('./modules/todos/todo.routes')

const PORT = process.env.PORT || 1000

const app = express()

app
  .use(cors())
  .use(express.json())
  .use('/api', userRouter)
  .use('/api/todos', todoRouter)

app.listen(PORT, () => {
    console.log('SERVERS START PORT ' + PORT)
})



