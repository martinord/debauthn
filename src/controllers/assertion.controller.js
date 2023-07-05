const wauth = require('../webauthn')
const buff = require('../models/helpers').buff

const {
    // Registration
    generateRegistrationOptions,
    verifyRegistrationResponse,
    // Authentication
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} = require('@simplewebauthn/server')

exports.options = async function(req, res, next){
    try {
        const opts = {
            timeout: 60000,
            allowCredentials: req.session.registeredCredentials ? req.session.registeredCredentials.map(authenticator => ({
                id: buff.decode(authenticator.credentialID),
                type: 'public-key',
                transports: authenticator.transports
            })) : [],
            userVerification: 'discouraged',
            rpID: req.get('host').split(":")[0],
        };

        const options = generateAuthenticationOptions(opts);
        
        req.session.challenge = options.challenge;

        res.send(options)
        next()
    } catch (err) {
        next(err)
    }
}

exports.result = async function(req, res, next){
    expectedChallenge = req.session.challenge

    let credential = req.session.registeredCredentials.find(credential => credential.credentialID === req.body.id)

    let thisDevice = {
        credentialPublicKey: buff.decode(credential.credentialPublicKey),
        credentialID: buff.decode(credential.credentialID),
        counter: credential.counter,
        transports: credential.transports || [],
    }

    try {
        const opts = {
            response: req.body,
            expectedChallenge: `${expectedChallenge}`,
            expectedOrigin,
            expectedRPID: req.get('host').split(":")[0],
            requireUserVerification: false,
            authenticator: thisDevice,
        };
        verification = await verifyAuthenticationResponse(opts);

        const { verified, authenticationInfo } = verification;

        if (verified) {
            // Update the authenticator's counter in the DB to the newest count in the authentication
            credential.counter = authenticationInfo.newCounter;
        }

        // Encode verification buffers
        var response_data = JSON.parse(JSON.stringify(verification))
        if (verification.authenticationInfo.credentialID) response_data.authenticationInfo.credentialID = buff.encode(verification.authenticationInfo.credentialID);

        res.send(response_data)
    } catch (err) {
        console.error(err)
        next(err)   // send to error handler
    }
}