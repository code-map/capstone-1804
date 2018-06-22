const express = require('express')
const router = express()

const dummyData = require('../../script/data/path.js')

router.get('/:categoryId/popular-paths', (req,res,next) => {
  //dummy code
  const sortedDummyData = dummyData.slice().sort()
  res.send(sortedDummyData.slice(0,4))
  //end of dummy code
})

router.get('/:categoryId/all-paths', (req,res,next) => {
  //dummy code
  res.send(dummyData)
  //end of dummy code
})

router.get('/:categoryId/search', (req,res,next) => {
  //dummy code
  const searchVal = req.body
  res.send(dummyData.slice(0,2))
  //end of dummy code
})

module.exports = router
