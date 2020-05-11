const buff = require('./helpers').buff

/**
 * https://www.w3.org/TR/webauthn/#dictionary-makecredentialoptions
 */
class PublicKeyCredentialCreationOptions {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with challenge and user.id as base64 buffers
     */
    static decode(o){
        var obj = {}

        // required
        obj.rp = o.rp;
        obj.user = o.user;
        obj.user.id = buff.decode(o.user.id);
        obj.challenge = buff.decode(o.challenge);
        obj.pubKeyCredParams = o.pubKeyCredParams;
        
        // optional
        if(o.attestation)
            obj.attestation = o.attestation;
        if(o.timeout)
            obj.timeout = o.timeout
        if(o.excludeCredentials)
            obj.excludeCredentials = o.excludeCredentials
        if(o.authenticatorSelection)
            obj.authenticatorSelection = o.authenticatorSelection
        // if(o.extensions)
        //     obj.extensions = o.extensions
        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64
     * @param {} o PublicKeyCredentialCreationOptions
     */
    static encode(o){
        var obj = {}

        // required
        obj.rp = o.rp;
        obj.user = o.user;
        obj.user.id = buff.encode(o.user.id);
        obj.challenge = buff.encode(o.challenge);
        obj.pubKeyCredParams = o.pubKeyCredParams;
        
        // optional
        if(o.attestation)
            obj.attestation = o.attestation;
        if(o.timeout)
            obj.timeout = o.timeout
        if(o.excludeCredentials)
            obj.excludeCredentials = o.excludeCredentials
        if(o.authenticatorSelection)
            obj.authenticatorSelection = o.authenticatorSelection
        // if(o.extensions)
        //     obj.extensions = o.extensions
        return obj;
    }
}

class PublicKeyCredentialCreationExpectations{
    /**
     * 
     * @param {*} challenge Base64 encoded challenge
     * @param {*} origin Origin URL (e.g. https://my.origin.com)
     * @param {*} factor "first", "second" or "either"
     */
    constructor(challenge, origin, factor){
        this.challenge = challenge;
        this.origin = origin;
        this.factor = factor;
    }
}

class AuthenticatorAttestationResponse {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with response.attestationObject and response.clientDataJSON e
     *              encoded as base64 buffers
     */
    static decode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId).buffer;
        obj.response = {
            attestationObject: o.response.attestationObject,
            clientDataJSON: o.response.clientDataJSON
        };
        return obj;
    }

    /**
     * Encodes the buffers in the object to base64
     * @param {} o AuthenticatorAttestationResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId);
        obj.response = {
            attestationObject: buff.encode(o.response.attestationObject),
            clientDataJSON: buff.encode(o.response.clientDataJSON)
        };
        return obj;
    }
}

module.exports = {
    PublicKeyCredentialCreationOptions,
    PublicKeyCredentialCreationExpectations,
    AuthenticatorAttestationResponse 
}