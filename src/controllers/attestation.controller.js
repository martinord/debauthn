const { response } = require('express')
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

    const userId = wauth.generateRandomUserId()

    const opts = {
        rpName: 'DebAuthn',
        rpID: globalThis.rpID,
        userID: userId,
        userName: 'john.smith@debauthn.example',
        timeout: 60000,
        attestationType: 'direct',
        excludeCredentials: req.session.registeredCredentials ? req.session.registeredCredentials.map(authenticator => ({
                id: buff.decode(authenticator.credentialID),
                type: 'public-key',
                transports: authenticator.transports
            })) : [],
        authenticatorSelection: {
            requireResidentKey: false,
            userVerification: 'discouraged',
            residentKey: 'discouraged'
        },
        supportedAlgorithmIDs: [-7, -257],
        extensions: {
            credProps: true,
            hmacCreateSecret: false
        }
    };

    const options = generateRegistrationOptions(opts);

    // stores challenge and user id in session and sends options to client
    req.session.challenge = options.challenge
    req.session.userHandle = userId
    res.send(options)

    next()
}

exports.result = async function(req, res, next){
    expectedChallenge = req.session.challenge
    userHandle = req.session.userHandle
    attResponse = req.body
    
    let verification;

    try {
        const opts = {
            response: attResponse,
            expectedChallenge: `${expectedChallenge}`,
            expectedOrigin,
            expectedRPID: globalThis.rpID,
            requireUserVerification: false,
            supportedAlgorithmIDs: [-7, -257]
        };
        verification = await verifyRegistrationResponse(opts);

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const { credentialPublicKey, credentialID, counter } = registrationInfo;

            const newDevice = {
                credentialPublicKey: buff.encode(credentialPublicKey),
                credentialID: buff.encode(credentialID),
                counter,
                transports: attResponse.transports || [],
            };

            if(req.session.registeredCredentials === undefined)
                req.session.registeredCredentials = []

            req.session.registeredCredentials.push(newDevice)

            // Encode verification buffers
            var response_data = JSON.parse(JSON.stringify(verification))
            if (verification.registrationInfo.attestationObject) response_data.registrationInfo.attestationObject = buff.encode(verification.registrationInfo.attestationObject);
            if (verification.registrationInfo.credentialID) response_data.registrationInfo.credentialID = buff.encode(verification.registrationInfo.credentialID);
            if (verification.registrationInfo.credentialPublicKey) response_data.registrationInfo.credentialPublicKey = buff.encode(verification.registrationInfo.credentialPublicKey);

            res.send(response_data)
        }
    } catch (error) {
        next(error) //send to error handler
    }
}