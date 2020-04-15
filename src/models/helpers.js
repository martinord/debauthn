/**
 * Encode and decode buffers to/from base64
 */
exports.buff = {
    encode: (b) => Buffer.from(b).toString('base64'),
    decode: (s) => Buffer.from(s, 'base64')
}