const express = require('express'),
      session = require('express-session'),
      mongoStore = require('connect-mongo')(session),
      mongoose = require('mongoose'),
      fs = require('fs'),
      https = require('https'),
      history = require('connect-history-api-fallback')
const config = require('./config/server.js')    // configuration file
const app = express()

// Connect to Mongo
mongoose.connect("mongodb://"+config.mongo+"/debauthn", { 
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
app.use(express.json())

// Use frontend router history mode
app.use(history())

// Serve static content
app.use('/', express.static('src/public'))

// Load routes
app.use('/', require('./routes'))

// Load error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send(err.message)
    next()
})

globalThis.rpID = config.rpID || 'localhost';

if(config.tlsEnabled){
    // Configure HTTPS
    var privateKey  = fs.readFileSync(config.tls.privateKey, 'utf8')    // TLS
    var certificate = fs.readFileSync(config.tls.certificate, 'utf8')   // TLS
    var tls = {key: privateKey, cert: certificate}; // TLS

    var httpsServer = https.createServer(tls, app);

    const port = config.port
    httpsServer.listen(port, () => console.log(`Basic app listening on https://localhost:${port}/ !`))
    globalThis.expectedOrigin = config.origin || `https://${rpID}:${port}`;
} else{
    // Configure HTTP
    const port = config.port
    app.listen(port, () => console.log(`Basic app listening on http://localhost:${port}/ !`))
    globalThis.expectedOrigin = config.origin || `https://${rpID}:${port}`;
}