const router = require('express').Router()
module.exports = router

const requireUserLogin = function(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.status(403).send('Unauthorized')
  }
}

router.use('/userAuth/', requireUserLogin, require('./userAuth'))
router.use('/users', require('./users'))
router.use('/paths', require('./paths'))
router.use('/categories', require('./categories'))
router.use('/resources', require('./resources'))
router.use('/search', require('./search'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
