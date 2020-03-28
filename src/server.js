const express = require('express')
const config = require('./config/server.js')
const app = express()

// Load routes
app.use('/', require('./routes'))

const port = config.port
app.listen(port, () => console.log(`Basic app listening on http://localhost:${port}/ !`))