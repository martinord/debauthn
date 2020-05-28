var router = require('express').Router()
const attestationController = require('../controllers/registered.controller')

router.get('/', attestationController.getRegisteredCredentials)

module.exports = router