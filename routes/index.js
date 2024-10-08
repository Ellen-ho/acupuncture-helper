const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const patients = require('./modules/patients')
const users = require('./modules/users')  

const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/', authenticator, home)
router.use('/records', authenticator, records)
router.use('/patients', authenticator, patients)

module.exports = router
