let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()

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

// POST: api/paths/add
router.post('/add', async (req, res, next) => {
  try {
    const userNode = `
    MATCH (u:User) WHERE u.name = {username}
    CREATE (p:Path {name: {name}, description: {description}, level: {level}, status: {status}, owner: {username}}),
    (u)-[:PATHS {notes: {notes}}]->(p)`

    const created = await session.run(userNode, {
      username: req.body.user,
      name: req.body.name,
      description: req.body.description,
      level: req.body.level,
      status: 'draft',
      notes: ''
    })

    const result = [
      { details: { properties: created.summary.statement.parameters } }
    ]

    res.send(result)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
