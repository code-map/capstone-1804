let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
//dummy code
const dummyData = require('../../script/data/path.js')
//end of dummy code

router.get('/hello', (req, res, next) => {
  session.run(`match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
  where p.name='Sequelize Basics'
  return collect({step: properties(s), resource: properties(r)})`).then(result => result.records.forEach(rec => {
    console.log(rec._fields)
  })).then(session.close())
})


router.get('/:categoryId/popular-paths', (req,res,next) => {
  //dummy code
  console.log('dummyData =', dummyData)
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
