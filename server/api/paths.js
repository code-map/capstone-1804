let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()

// GET: api/paths
router.get('/', async (req, res, next) => {
  try {
    const query = `match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(res:Resource) return properties(p),collect({step: properties(s),resource: properties(res)})`

    const result = await session.run(query)

    const allPaths = result.records.map((record) => {
      return record._fields
    })

    res.send(allPaths)
    session.close()
  } catch (err) { next(err) }
})

// GET: api/paths/:name
router.get('/:name', async (req, res, next) => {

  try {
    const param = req.params.name

    const query = `match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(res:Resource)
    where p.name = {name}
    return properties(p),collect({step: properties(s),resource: properties(res)})`

    const result = await session.run(query, {name: param})

    const allPaths = result.records.map((record) => {
      return record._fields
    })

    res.send(allPaths)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
