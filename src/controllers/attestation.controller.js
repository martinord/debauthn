const wauth = require('../webauthn')

exports.options = async function(req, res, next){
    // get origin from request
    origin = 'https://'+req.get('host')
    registeredCredentials = req.session.registeredCredentials
    // webauthn begin attestation
    att = await wauth.beginAttestation(
        origin,
        "either",    // TODO: create configuration for this
        registeredCredentials
    )
    // stores expectations and user id in session and sends options to client
    req.session.attExpectations = att.expectations
    req.session.userHandle = att.userHandle
    res.send(att.options)

    next()
}

exports.result = async function(req, res, next){
    attExpectations = req.session.attExpectations
    userHandle = req.session.userHandle
    attResponse = req.body
    
    try{
        att = await wauth.finishAttestation(attResponse, attExpectations, userHandle)
        // stores credential and sends attestation result
        if(req.session.registeredCredentials === undefined)
            req.session.registeredCredentials = []
        req.session.registeredCredentials.push(att.credential)
        res.send(att.result)
        next()
    } catch(err) {
        next(err)   // send to error handler
    }
}
