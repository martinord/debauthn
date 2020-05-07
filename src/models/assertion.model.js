const buff = require('./helpers').buff

class PublicKeyCredentialRequestOptions {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with challenge  and allowCredentials id element as base64 buffers
     */
    static decode(o){
        var obj = {}
        obj.challenge = buff.decode(o.challenge)
        obj.timeout = o.timeout
        obj.allowCredentials = [    // TODO: only supports one credential
            {
                type: "public-key",
                id: buff.decode(o.allowCredentials[0].id) 
            }
        ]
        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64
     * @param {} o PublicKeyCredentialRequestOptions
     */
    static encode(o){
        var obj = {}
        obj.timeout = o.timeout
        obj.allowCredentials = o.allowCredentials
        obj.challenge = buff.encode(o.challenge)
        return obj;
    }
}

class PublicKeyCredentialRequestExpectations{
    /**
     * 
     * @param {*} challenge Base64 encoded challenge
     * @param {*} origin Origin URL (e.g. https://my.origin.com)
     * @param {*} factor "first", "second" or "either"
     */
    constructor(challenge, origin, factor, publicKey, prevCounter, userHandle){
        this.challenge = challenge;
        this.origin = origin;
        this.factor = factor;
        this.publicKey = publicKey;
        this.prevCounter = prevCounter;
        this.userHandle = userHandle;
    }
}

class AuthenticatorAssertionResponse {
    /**
     * Creates an object from an base64 buffers encoded object
     * @param {*} o object with response elements encoded as base64 buffers
     */
    static decode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId).buffer;
        obj.response = {
            authenticatorData: o.response.authenticatorData,
            clientDataJSON: o.response.clientDataJSON,
            signature: o.response.signature
        };
        if(o.response.userHandle)   // snippet for fixing userHandle when null
            obj.response.userHandle = o.response.userHandle
        return obj;
    }

    /**
     * Encodes the buffers in the object to base64
     * @param {} o AuthenticatorAssertionResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = Buffer.from(o.rawId);
        obj.response = {
            authenticatorData: buff.encode(o.response.authenticatorData),
            clientDataJSON: buff.encode(o.response.clientDataJSON),
            signature: buff.encode(o.response.signature),
            userHandle: o.response.userHandle ? buff.encode(o.response.userHandle) : o.response.userHandle
        };
        return obj;
    }
}

module.exports = {
    PublicKeyCredentialRequestExpectations,
    PublicKeyCredentialRequestOptions,
    AuthenticatorAssertionResponse
}