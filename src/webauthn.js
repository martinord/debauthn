const fido2lib = require('fido2-lib').Fido2Lib
const { PublicKeyCredentialCreationOptions, 
        AuthenticatorAttestationResponse,
        PublicKeyCredentialCreationExpectations 
    } = require('./models/attestation.model')

var wauth = new fido2lib({
    // TODO: Configure library instance
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
    return attResult
}