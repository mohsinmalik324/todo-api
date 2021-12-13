import express from 'express'
import createRouteHandler from './routes/create'
import deleteRouteHandler from './routes/delete'
import updateRouteHandler from './routes/update'
import getRouteHandler from './routes/get'

const app = express()
const port = 3000
const route = '/v1/todo'

app.use(express.json())

app.get(route, getRouteHandler)

app.post(
  route,
  createRouteHandler
)

app.delete(route, deleteRouteHandler)
app.patch(route, updateRouteHandler)

app.listen(port, () => console.log(`Server running on localhost:${port}`))
