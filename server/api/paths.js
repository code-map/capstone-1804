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
    return { details: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const singlePath = result.records.map((record) => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) { next(err) }
})

// GET: api/paths/:name/steps
router.get('/:name/steps', async (req, res, next) => {
  try {
    const param = req.params.name

    const query = `match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    WHERE p.name = {name}
    return { steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const steps = result.records.map((record) => {
      return record._fields
    })

    res.send(steps[0])
    session.close()
  } catch (err) { next(err) }
})

// GET: api/paths/user/:name
router.get('/user/:name/', async (req, res, next) => {
  try {
    const param = req.params.name

    // const query = `match(u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    // where u.name = {name}
    // return {path: p, steps: collect({step: s, resource: r })}`

    const query = `match(a:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    where a.name='dwn-berry'
    return properties(p), collect({step:properties(s), resource:properties(r)})`

    const result = await session.run(query, {name: param})

    const paths = result.records.map((record) => {
      return record._fields
    })

    res.send(paths)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
