let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()

router.get('/hello', (req, res, next) => {
  session.run(`match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
  where p.name='Sequelize Basics'
  return collect({step: properties(s), resource: properties(r)})`).then(result => result.records.forEach(rec => {
    console.log(rec._fields)
  })).then(session.close())
})

module.exports = router
