let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
const dummyPaths = require('../../script/data/path.js')

// GET: api/paths/all/user/:username/
router.get('/all/user/:username/', async (req, res, next) => {
  try {
    const param = req.params.username

    const query = `match(u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    where u.name = {username}
    return {details: p, steps: collect({step: s, resource: r })}`

    const result = await session.run(query, {username: param})

    const paths = result.records.map((record) => {
      return record._fields
    })

    res.send(paths)
    session.close()
  } catch (err) { next(err) }
})
/*
/api/paths/popular-paths
*/

router.get('/popular-paths', (req,res,next) => {
  //dummy code
  const sortedDummyData = dummyPaths.slice().sort()
  res.send(sortedDummyData.slice(0,4))
  //end of dummy code
})



module.exports = router
