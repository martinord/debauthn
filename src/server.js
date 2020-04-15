const express = require('express'),
      session = require('express-session'),
      mongoStore = require('connect-mongo')(session),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      https = require('https')
const config = require('./config/server.js')    // configuration file
var privateKey  = fs.readFileSync(config.tls.privateKey, 'utf8')    // TLS
var certificate = fs.readFileSync(config.tls.certificate, 'utf8')   // TLS
var tls = {key: privateKey, cert: certificate}; // TLS
const app = express()

// Connect to Mongo
mongoose.connect(config.mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})

// Configure session
app.use(session({
    secret: config.secret,
    clear_interval: 10000,
    resave: true,
    cookie: {
        maxAge: 1 * 60 * 60, // = 1h
        httpOnly: false
    },
    saveUninitialized: true,
    store: new mongoStore({ 
        mongooseConnection: mongoose.connection,
        ttl: 1 * 60 * 60, // = 1h
        autoRemove: 'native'
    })
}))

// Body Parser
app.use(bodyParser.json())

// Serve static content
app.use('/', express.static('src/public'))

// Load routes
app.use('/', require('./routes'))

// Configure HTTPS
var httpsServer = https.createServer(tls, app);

const port = config.port
httpsServer.listen(port, () => console.log(`Basic app listening on https://localhost:${port}/ !`))