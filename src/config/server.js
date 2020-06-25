module.exports = {
    port: process.env.PORT || 5000,
    secret: process.env.SECRET || "SecretTestForDevelopment",
    mongoURI: "mongodb://"+process.env.MONGO+"/debauthn" || "mongodb://localhost/debauthn",
    tlsEnabled: process.env.TLS == 'true',
    tls: {
        privateKey: "tls/private.key",
        certificate: "tls/certificate.crt"
    }
}