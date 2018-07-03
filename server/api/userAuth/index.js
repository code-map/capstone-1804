const router = require('express').Router()
module.exports = router

// api/userAuth/paths
router.use('/paths', require('./paths'))

module.exports = router
