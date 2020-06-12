var router = require('express').Router()
const attestationController = require('../controllers/registered.controller')

router.get('/', attestationController.getRegisteredCredentials)
router.delete('/', attestationController.deleteRegisteredCredentials)

module.exports = router