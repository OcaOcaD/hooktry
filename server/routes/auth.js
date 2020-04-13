const express = require('express')
const router = express.Router()
// Import controller
const {signup, accountActivation, signin} = require('../controllers/auth')

const bot = require('../controllers/bot')


// Import validators
const { userSignupValidator, userSigninValidator } = require('../validators/auth')
const { runValidation } = require('../validators/index')

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin', userSigninValidator, runValidation, signin)

router.post('/bot', bot)

module.exports = router // {}