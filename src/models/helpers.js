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

        return thing
    }
}

exports.mapToJSON = function (map) {
    if (!(map instanceof Map) && !(map instanceof Set))
        throw new TypeError("Cannot convert to object. Type is not Map or Set")

    var array = Array.from(map.entries()) // array of touples
    var obj = {}
    array.forEach(function(data){
        var index = data[0]
        var info = data[1]
        if(info instanceof ArrayBuffer || info instanceof Buffer)
            info = exports.buff.encode(info)    // typecast to base64
        else if(info instanceof Map || info instanceof Set)
            info = exports.mapToJSON(info)
        else if(JSON.stringify(info)==="{}"){   // the object will not be stringified
            var data = []
            for(let [key, value] of Object.entries(info)){
                data.push(key + ": " + value)
            }
            info = data
        }
        obj[index] = info
    })
    return obj
}