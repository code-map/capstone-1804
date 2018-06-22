const express = require('express')
const router = express()

const dummyData = require('../../script/data/path.js')

router.get('/:categoryId/popular-paths', (req,res,next) => {
  console.log('hello we are in dummydata')
  console.log('dummydata is', dummyData)
  res.send(dummyData)
})

module.exports = router
