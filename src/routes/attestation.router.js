var router = require('express').Router()
const attestationController = require('../controllers/attestation.controller')

router.post('/options', attestationController.options)
router.post('/result', attestationController.result)

module.exports = router