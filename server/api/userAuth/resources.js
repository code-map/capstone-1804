let neo4j = require('neo4j-driver').v1
let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
let session = driver.session()
const express = require('express')
const router = express.Router()
const shortid = require('shortid')

// POST: /api/userAuth/resources/:url/review
router.post('/:url/review', async (req, res, next) => {

  if (req.user.name !== req.body.username ){
    res.status(403).send('Unauthorized')
  }

  const createdDate = Date.now()
  const uid = shortid.generate()
  const url = decodeURIComponent(req.params.url)
  const name = req.body.user
  const score = req.body.value

  try {
    const query = `
    MATCH (u:User), (r:Resource)
    WHERE u.name = {name} AND r.url = {url}
    MERGE (u)-[:REVIEWS]->(rev:Review)-[:REVIEWS]->(r)
    ON CREATE SET
      rev.score = {score},
      rev.createdDate = {createdDate},
      rev.uid = {uid}
    ON MATCH SET
      rev.score = {score}
    RETURN u, rev, r
    `

    const result = await session.run(query, {uid, name, url, score, createdDate})

    res.send(result)
  } catch (err) { next(err) }

})


module.exports = router

