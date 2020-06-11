const wauth = require('../webauthn')

exports.options = async function(req, res, next){
    // get origin from request
    origin = 'https://'+req.get('host')
    registeredCredentials = req.session.registeredCredentials
    try {
        // webauthn begin assertion
        ass = await wauth.beginAssertion(
            origin,
            "either",    // TODO: create configuration for this
            registeredCredentials
        )
        // stores expectations in session and sends options to client
        req.session.assExpectations = ass.expectations
        res.send(ass.options)
        next()
    } catch (err) {
        next(err)
    }
}

exports.result = async function(req, res, next){
    assExpectations = req.session.assExpectations
    registeredCredentials = req.session.registeredCredentials
    assResponse = req.body
    try {
        ass = await wauth.finishAssertion(assResponse, assExpectations, registeredCredentials)
        // sends the result
        res.send(ass.result)
        next()
    } catch (err) {
        next(err)   // send to error handler
    }
}