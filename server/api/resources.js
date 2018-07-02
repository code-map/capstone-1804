// let neo4j = require('neo4j-driver').v1;
// let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// let session = driver.session();
let session = require('../db/neo')

const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

router.get(`/:resourceName/reviews`, async (req,res,next) => {
  try{
    const resourceName = req.params.resourceName
    const query =
    `
      MATCH(u:User)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r:Resource)
      WHERE r.name={resourceName}
      RETURN r.name AS resource,
             u.name AS author,
             rev.comments AS comments,
             rev.score AS score
      ORDER BY score
      limit 3
    `
    const result = await session.run(query, {resourceName})

    const reducedResponse = recordsReducer(result.records)
    const groupedResponse = {}
    groupedResponse[resourceName] = reducedResponse

    res.send(groupedResponse)
    session.close()
  }catch(e){
    next(e)
  }
})

router.get('/:resourceUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    const query = `
    MATCH (r:Resource) WHERE r.uid = {uid}
    RETURN r`

    const result = await session.run(query, {uid: param})

    const singleRecord = result.records.map((record) => {
      return record._fields
    })

    res.send(singleRecord)
    session.close()

  }catch(err){
    console.error(err)
    next(err)
  }
})

module.exports = router
