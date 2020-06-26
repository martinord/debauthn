module.exports = {
    port: process.env.PORT || 5000,
    secret: process.env.SECRET || "SecretTestForDevelopment",
    mongo: process.env.MONGO || "localhost",
    tlsEnabled: process.env.TLS == 'true',
    tls: {
        privateKey: "tls/private.key",
        certificate: "tls/certificate.crt"
    }
}