var router = require('express').Router()
const assertionController = require('../controllers/assertion.controller')

router.post('/options', assertionController.options)
router.post('/result', assertionController.result)

module.exports = router