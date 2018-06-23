let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()

// GET: api/paths/:name
router.get('/:name', async (req, res, next) => {

  try {
    const param = req.params.name

    const query = `match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    WHERE p.name = {name}
    return { path: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const singlePath = result.records.map((record) => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
