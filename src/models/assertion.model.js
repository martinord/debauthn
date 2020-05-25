const buff = require('./helpers').buff

/**
 * https://www.w3.org/TR/webauthn/#assertion-options
 */
class PublicKeyCredentialRequestOptions {
    /**
     * Creates an object from an base64url buffers encoded object
     * @param {*} o object with challenge  and allowCredentials id element as base64url buffers
     */
    static decode(o){
        var obj = {}

        // required
        obj.challenge = buff.decode(o.challenge)
        
        // optional
        if(o.timeout)
            obj.timeout = o.timeout

        if(o.allowCredentials){
            obj.allowCredentials = []
            o.allowCredentials.forEach(function(credential){
                obj.allowCredentials.push({
                    type: "public-key",
                    id: buff.decode(credential.id) 
                })
            })
        }
        
        if(o.userVerification)
            obj.userVerification = o.userVerification

        if(o.rp)
            obj.rp = { id: buff.decode(o.rp.id) }
        
        // if(o.extensions)
        //     obj.extensions = o.extensions

        return obj;
    }
    
    /**
     * Encodes the buffers in the object to base64url
     * @param {} o PublicKeyCredentialRequestOptions
     */
    static encode(o){
       var obj = {}

        // required
        obj.challenge = buff.encode(o.challenge)
        
        // optional
        if(o.timeout)
            obj.timeout = o.timeout

        if(o.allowCredentials){
            obj.allowCredentials = []
            o.allowCredentials.forEach(function(credential){
                obj.allowCredentials.push({
                    type: "public-key",
                    id: buff.encode(credential.id) 
                })
            })
        }
        
        if(o.userVerification)
            obj.userVerification = o.userVerification

        if(o.rp)
            obj.rp = { id: buff.encode(o.rp.id) }
        
        // if(o.extensions)
        //     obj.extensions = o.extensions
        
        return obj;
    }
}

class PublicKeyCredentialRequestExpectations{
    /**
     * 
     * @param {*} challenge base64url encoded challenge
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
     * Creates an object from an base64url buffers encoded object
     * @param {*} o object with response elements encoded as base64url buffers
     */
    static decode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = buff.decode(o.rawId);
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
     * Encodes the buffers in the object to base64url
     * @param {} o AuthenticatorAssertionResponse
     */
    static encode(o){
        var obj = {};
        obj.id = o.id;
        obj.rawId = buff.encode(o.rawId);
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