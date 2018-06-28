let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
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
      ORDER BY resource
    `
    const result = await session.run(query, {resourceName})
  
    const reducedResponse = recordsReducer(result.records)
    const groupedResponse = {}
    groupedResponse[resourceName] = reducedResponse
    console.log('grouped response=',groupedResponse)
    res.send(groupedResponse)
    session.close()
  }catch(e){
    next(e)
  }
})

module.exports = router


             //r.properties.createdDate.low AS date
