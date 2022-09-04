const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error.middleware');

dotenv.config()

const userRouter = require('./modules/users/user.routes')
const todoRouter = require('./modules/todos/todo.routes')

const PORT = process.env.PORT || 1000

const app = express()

app
  .use(express.json())
  .use(cookieParser())
  .use(cors())
  .use('/api', userRouter)
  .use('/api/todos', todoRouter)
  .use(errorMiddleware)


app.listen(PORT, () => {
    console.log('SERVERS START PORT ' + PORT)
})



