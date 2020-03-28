var router = require('express').Router()

// Declare root route
router.get('/', (req, res) => res.send('Relying Party for WebAuthn debugging tool'))

// Loading routers
router.use('/attestation', require('./attestation.router'))
router.use('/assertion', require('./assertion.router'))

module.exports = router