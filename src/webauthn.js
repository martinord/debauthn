const fido2lib = require('fido2-lib').Fido2Lib
const config = require('./config/webauthn')
const { PublicKeyCredentialCreationOptions, 
        AuthenticatorAttestationResponse,
        PublicKeyCredentialCreationExpectations 
    } = require('./models/attestation.model')

const { PublicKeyCredentialRequestOptions,
        AuthenticatorAssertionResponse,
        PublicKeyCredentialRequestExpectations
} = require('./models/assertion.model')
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
        result: attResult, 
        credential: {
            publicKey: attResult.authnrData.get('credentialPublicKeyPem'),
            counter: attResult.authnrData.get('counter'),
            rawId: Buffer.from(attResult.authnrData.get('credId')).toString('base64')
        }
    }
}

exports.beginAssertion = async function(origin, factor, allowCredentials){
    options = await wauth.assertionOptions()
    // Assign expectations for Attestation to be stored
    options.allowCredentials = [{ id: allowCredentials[0].rawId }] // TODO: change with model, only supports one
    options = PublicKeyCredentialRequestOptions.encode(options)
    expectations = new PublicKeyCredentialRequestExpectations(
        options.challenge,
        origin,
        factor,
        allowCredentials[0].publicKey,  // TODO: change, only supports one
        allowCredentials[0].counter,    
        null    // user handle
    )
    return { options: options, expectations: expectations } 
}

exports.finishAssertion = async function(assResponse, assExpectations){
    assResponse = AuthenticatorAssertionResponse.decode(assResponse)
    assResult = await wauth.assertionResult(assResponse, assExpectations)

    return { result: assResult,/* counter: ....*/ }
}