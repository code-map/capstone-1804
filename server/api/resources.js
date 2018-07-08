// let neo4j = require('neo4j-driver').v1;
// let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// let session = driver.session();
let session = require('../db/neo')

const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

router.get(`/:uid/reviews`, async (req,res,next) => {
  try{
    const uid = req.params.uid
    const query =
    `
      MATCH(u:User)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r:Resource)
      WHERE r.uid={uid}
      RETURN r.name AS resource,
             u.name AS author,
             rev.comments AS comments,
             rev.score AS score
    `

    const result = await session.run(query, {uid})

    const reducedResponse = recordsReducer(result.records)
    const groupedResponse = {}
    groupedResponse['data'] = reducedResponse
    groupedResponse.uid = uid

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







router.get('/:pathuid/:resourceuid/suggestions', async (req, res, next) => {
  try {
    const { resourceuid, pathuid } = req.params
    const getCategoryQuery = `
    MATCH (p:Path)-[:CATEGORY]->(c)
    WHERE p.uid = {pathuid}
    RETURN c
    `
    const findCategory = await session.run(getCategoryQuery, {pathuid})
    const category = findCategory.records[0]._fields[0].properties.name
    console.log(category)
    const query =  `MATCH (c:Category), (rev:Review), (resource:Resource),
    (rev)-[re:REVIEWS]->(resource)-[:CATEGORY]->(c:Category)
    WHERE c.name = {category} AND resource.uid <> {resourceuid}
    WITH resource.name as name, resource.uid as uid, resource.url as url, resource.slug as slug, count(rev) AS numReviews , avg(rev.score) AS averageRating
    RETURN name, uid, url, slug, numReviews, averageRating, averageRating * log(numReviews)/log(15) as WeightedScore
    ORDER BY WeightedScore desc`

    const { records } = await session.run(query, {category, resourceuid})

    res.json(records)

  }catch(err){
    console.error(err)
    next(err)
  }

})

module.exports = router
