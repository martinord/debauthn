const wauth = require('../webauthn')

exports.options = async function(req, res, next){
    // get origin from request
    origin = 'https://'+req.get('host')
    // webauthn begin attestation
    att = await wauth.beginAttestation(
        origin,
        "either"    // TODO: create configuration for this
    )
    // stores expectations in session and sends options to client
    req.session.attExpectations = att.expectations
    res.send(att.options)

    next()
}

exports.result = async function(req, res, next){
    attExpectations = req.session.attExpectations
    attResponse = req.body
    
    attResult = await wauth.finishAttestation(attResponse, attExpectations)
    res.send(attResult)

    next()
}
