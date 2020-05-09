/**
 * Encode and decode buffers to/from base64
 */
exports.buff = {
    encode(thing){
        // Array to Uint8Array
        if (Array.isArray(thing)) {
            thing = Uint8Array.from(thing);
        }

        // Uint8Array, etc. to ArrayBuffer
        if (thing.buffer instanceof ArrayBuffer && !(thing instanceof Buffer)) {
            thing = thing.buffer;
        }

        // ArrayBuffer to Buffer
        if (thing instanceof ArrayBuffer && !(thing instanceof Buffer)) {
            thing = Buffer.from(thing);
        }

        // Buffer to base64 string
        if (thing instanceof Buffer) {
            thing = thing.toString("base64");
        }

        if (typeof thing == "string") {
            // base64 to base64url
            // NOTE: "=" at the end of challenge is optional, strip it off here so that it's compatible with client
            thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");
        }
        
        return thing
    },
    decode(thing) {
        if (typeof thing === "string") {
            // base64url to base64
            thing = thing.replace(/-/g, "+").replace(/_/g, "/");
            // base64 to Buffer
            thing = Buffer.from(thing, "base64");
        }
    
        // Buffer or Array to Uint8Array
        if (thing instanceof Buffer || Array.isArray(thing)) {
            thing = new Uint8Array(thing);
        }
    
        // Uint8Array to ArrayBuffer
        if (thing instanceof Uint8Array) {
            thing = thing.buffer;
        }

        return thing
    }
}