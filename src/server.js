const express = require('express'),
      session = require('express-session'),
      mongoStore = require('connect-mongo')(session),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      https = require('https')
const config = require('./config/server.js')    // configuration file
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
        httpOnly: true  // prevent client-side JS to access cookie (OWASP)
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

if(config.tlsEnabled){
    // Configure HTTPS
    var httpsServer = https.createServer(tls, app);

    var privateKey  = fs.readFileSync(config.tls.privateKey, 'utf8')    // TLS
    var certificate = fs.readFileSync(config.tls.certificate, 'utf8')   // TLS
    var tls = {key: privateKey, cert: certificate}; // TLS
    
    const port = config.port
    httpsServer.listen(port, () => console.log(`Basic app listening on https://localhost:${port}/ !`))
} else{
    // Configure HTTP
    const port = config.port
    app.listen(port, () => console.log(`Basic app listening on http://localhost:${port}/ !`))
}