module.exports = {
    rpID: process.env.RP_ID || "localhost",
    port: process.env.PORT || 5000,
    origin: process.env.ORIGIN, // for reverse proxy deployments
    secret: process.env.SECRET || "SecretTestForDevelopment",
    mongo: process.env.MONGO || "localhost",
    tlsEnabled: process.env.TLS == 'true',
    tls: {
        privateKey: "tls/private.key",
        certificate: "tls/certificate.crt"
    }
}