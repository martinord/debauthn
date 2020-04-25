module.exports = {
    port: 5000,
    secret: "SecretTestForDevelopment",
    mongoURI: "mongodb://localhost/debauthn",
    tlsEnabled: false,
    tls: {
        privateKey: "tls/private.key",
        certificate: "tls/certificate.crt"
    }
}
// TODO: use NODE Environment