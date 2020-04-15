var router = require('express').Router()

// Loading routers
router.use('/attestation', require('./attestation.router'))
router.use('/assertion', require('./assertion.router'))

module.exports = router