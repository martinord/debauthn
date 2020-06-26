var router = require('express').Router()
const attestationController = require('../controllers/attestation.controller')

router.get('/options', attestationController.options)
router.post('/result', attestationController.result)

module.exports = router