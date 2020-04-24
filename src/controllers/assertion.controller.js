const wauth = require('../webauthn')

exports.options = async function(req, res, next){
    // get origin from request
    origin = 'https://'+req.get('host')
    allowCredentials = req.session.allowCredentials
    // webauthn begin assertion
    ass = await wauth.beginAssertion(
        origin,
        "second",    // TODO: create configuration for this
        allowCredentials
    )
    // stores expectations in session and sends options to client
    req.session.assExpectations = ass.expectations
    res.send(ass.options)

    next()
}

exports.result = async function(req, res, next){
    assExpectations = req.session.assExpectations
    assResponse = req.body
    
    ass = await wauth.finishAssertion(assResponse, assExpectations)
    // stores new counter and sends assertion result
    // req.session.allowCredentials[0].counter = ass.counter   // only supports one registered credential
    res.send(ass.result)
    next()
}