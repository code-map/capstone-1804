let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

// GET: api/paths/all/user/:username/
router.get('/all/user/:username/', async (req, res, next) => {
  try {
    const param = req.params.username
    const query = `match(u:User) - [:PATHS*]->(p:Path)
    where u.name = {username}
    return {details: p}`

    const result = await session.run(query, {username: param})

    const paths = result.records.map((record) => {
      return record._fields
    })

    res.send(paths)
    session.close()
  } catch (err) { next(err) }
})

// returns the most popular paths (regardless of category)
// GET: api/paths/popular
router.get('/popular', async (req,res,next) => {
    const query = `MATCH (u: User)-[_p:PATHS]->(p: Path)<-[_r: REVIEWS]-(r:Review) 
      RETURN p.name AS name, 
             p.owner AS owner, 
             count(r) AS reviewCount, 
             count(distinct u) AS userCount, 
             avg(r.score) AS rating 
      ORDER BY rating DESC LIMIT 20`
    const result = await session.run(query)

    const reducedResponse = recordsReducer(result.records)
    res.send(reducedResponse)
})



// GET: api/paths/:name
router.get('/:name', async (req, res, next) => {
  try {
    const param = req.params.name

    const query = `
    MATCH (p:Path) WHERE p.name = {name}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const singlePath = result.records.map((record) => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) { next(err) }
})

// GET: api/paths/:name/user/:username/completed
router.get('/:name/user/:username/completed', async (req, res, next) => {
  try {
    const pathName = req.params.name
    const username = req.params.username

    const query = `MATCH (u)-[:PATHS]->(p:Path)
    WHERE p.name = {pathName} and u.name = {username}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
    RETURN { steps: collect({ step: s, resource: r, completed: c })}`

    const data = await session.run(query, {pathName, username})

    const steps = data.records.map((record) => {
      return record._fields[0].steps
    })

    const completionStatus = steps[0].map((el) => {
      const completed = el.completed !== null
      return {
        stepName: el.resource.properties.name,
        stepUrl:  el.resource.properties.url,
        completed
      }
    })

    res.send(completionStatus)
    session.close()
  } catch (err) { next(err) }
})

// PUT: api/paths/:pathName/user/:username/status/:bool/step/:stepUrl
router.put('/:pathName/user/:username/status/:completed/step/:stepUrl', async (req, res, next) => {
  try {

    const pathName = req.params.pathName
    const username = req.params.username
    const stepUrl = decodeURIComponent(req.params.stepUrl)
    const completed = req.params.completed
    let query = ''

    if (completed === 'true') {
      // Remove the relationship
      query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.name = {pathName} and r.url = {stepUrl}
      OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
      DELETE c
      `
    } else if (completed === 'false'){
      // Add the relationship
      query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.name = {pathName} and r.url = {stepUrl}
      CREATE (u)-[:COMPLETED]->(s)
      `
    }

    await session.run(query, {pathName, username, stepUrl})

    res.send(stepUrl)
    session.close()
  } catch (err) { next(err) }
})

// POST: api/paths/
router.post('/', async (req, res, next) => {

  const createdDate = Date.now()

  try {
    const newPath = `
    MATCH (u:User) WHERE u.name = {username}
    CREATE (p:Path {name: {name}, description: {description}, level: {level}, status: {status}, owner: {username}, createdDate: {createdDate}}),
    (u)-[:PATHS {notes: {notes}}]->(p)`

    const created = await session.run(newPath, {
      username: req.body.user,
      name: req.body.name,
      description: req.body.description,
      level: req.body.level,
      status: 'draft',
      notes: '',
      createdDate
    })

    const result = [
      { details: { properties: created.summary.statement.parameters } }
    ]

    res.send(result)
    session.close()
  } catch (err) { next(err) }
})

// DELETE: api/paths/:name
router.delete('/:name', async (req, res, next) => {
  try {
    const name = req.params.name

    const query = `
    MATCH (p:Path) WHERE p.name = {name}
    DETACH DELETE p`

    await session.run(query, {name})

    res.send(name)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
