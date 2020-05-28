const fido2lib = require('fido2-lib').Fido2Lib
const config = require('./config/webauthn')
const buff = require('./models/helpers').buff
const { PublicKeyCredentialCreationOptions, 
        AuthenticatorAttestationResponse,
        PublicKeyCredentialCreationExpectations 
    } = require('./models/attestation.model')

const { PublicKeyCredentialRequestOptions,
        AuthenticatorAssertionResponse,
        PublicKeyCredentialRequestExpectations
} = require('./models/assertion.model')

const { Validation } = require('./models/validation.model')

var wauth = new fido2lib({
    rpId: config.rpId,
    rpName: config.rpName,
    // authenticatorRequireResidentKey: false
})

/**
 * Starts Attestation ceremony and requests attestation options
 * @param origin: origin of the request (e.g. https://my.origin.com)
 * @param factor: "first", "second" or "either"
 */
exports.beginAttestation = async function(origin, factor){
    options = await wauth.attestationOptions()
    options.user.id = new Uint8Array(16)   // TODO: new random ID
    options = PublicKeyCredentialCreationOptions.encode(options)
    // Assign expectations for Attestation to be stored
    expectations = new PublicKeyCredentialCreationExpectations(
        options.challenge,
        origin, 
        factor    
    )
    return { options: options, expectations: expectations }   
}

exports.finishAttestation = async function(attResponse, attExpectations){
    attResponse = AuthenticatorAttestationResponse.decode(attResponse)
    attResult = await wauth.attestationResult(attResponse, attExpectations)     
    return { 
        result: new Validation({
            complete: attResult.audit.complete,
            info: attResult.audit.info,
            warning: attResult.audit.warning,
            authnrData: attResult.authnrData,
            clientData: attResult.clientData
        }),
        credential: {
            publicKey: attResult.authnrData.get('credentialPublicKeyPem'),
            counter: attResult.authnrData.get('counter'),
            rawId: buff.encode(attResult.authnrData.get('credId'))
        }
    }
}

exports.beginAssertion = async function(origin, factor, registeredCredentials){
    options = await wauth.assertionOptions()
    // Assign expectations for Attestation to be stored
    options.allowCredentials = []
    if(registeredCredentials == undefined)
        throw new Error("No registered credentials. Register a credential before authenticating")
    registeredCredentials.forEach(function(credential){
        options.allowCredentials.push({
            type: "public-key",
            id: credential.rawId
        })
    })
    options = PublicKeyCredentialRequestOptions.encode(options)
    expectations = {
        challenge: options.challenge,
        origin: origin,
        factor: factor
    }
    return { options: options, expectations: expectations } 
}

exports.finishAssertion = async function(assResponse, assExpectations, registeredCredentials){
    assResponse = AuthenticatorAssertionResponse.decode(assResponse)

    // create expectations for the concrete assessed credential
    var credential = registeredCredentials.find(cred => cred.rawId === assResponse.id) 
    assExpectations = new PublicKeyCredentialRequestExpectations(
        assExpectations.challenge,
        assExpectations.origin,
        assExpectations.factor,
        credential.publicKey,
        credential.counter,
        null // user handle
    )

    assResult = await wauth.assertionResult(assResponse, assExpectations)
    
    // update credential counter
    credential.counter = assResult.authnrData.get('counter')
    
    return {
        result: new Validation({
            complete: assResult.audit.complete,
            info: assResult.audit.info,
            warning: assResult.audit.warning,
            authnrData: assResult.authnrData,
            clientData: assResult.clientData
        })
    }
}