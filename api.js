const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes/routes.js')

app.use(cors({
    origin: process.env.CLIENT_URL,
    // credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api/v1', routes);

app.listen(process.env.PORT, () => console.log('server is running on port', process.env.PORT))