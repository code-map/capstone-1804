// let neo4j = require('neo4j-driver').v1
// let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
// let session = driver.session()
let session = require('../db/neo')

const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')
const {getMetadata} = require('../../script/metadata')

// GET: /api/paths/step/:url
router.get('/step/:url', async (req, res, next) => {
  try {
    const url = decodeURIComponent(req.params.url)

    const query = `
    MATCH (r:Resource) WHERE r.url = {url}
    return r
    `

    const result = await session.run(query, {url})

    if (result.records.length > 0) {
      const records = result.records.map(record => {
        return record._fields
      })
      res.send(records[0][0].properties)
    } else {
      let md = await getMetadata(url)
      res.send(md)
    }

    session.close()
  } catch (err) {
    next(err)
  }
})

// returns the most popular paths (regardless of category)
// GET: api/paths/popular
router.get('/popular', async (req,res,next) => {
  const query = `
    MATCH (u: User)-[_p:PATHS]->(p: Path {status: 'public'})<-[_r: REVIEWS]-(r:Review),
      (p)-[:CATEGORY]->(c:Category)
      RETURN p.name AS name,
             p.owner AS owner,
             count(r) AS reviewCount,
             count(distinct u) AS userCount,
             avg(r.score) AS rating,
             p.uid AS uid,
             p.slug AS slug,
             c.name AS category
      ORDER BY rating DESC LIMIT 8`

    const result = await session.run(query)

  const reducedResponse = recordsReducer(result.records)
  res.send(reducedResponse)
})

// GET: api/paths/:uid
router.get('/:pathUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    // const query = `
    // MATCH (p:Path) WHERE p.uid = {uid}
    // OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    // RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const query=`
      MATCH (p:Path), (u:User)-[:PATHS]->(p)
      WHERE p.uid = {uid}
      WITH p, count(distinct u) as subscribers
      OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      RETURN { details: p, steps: collect( { step: s, resource: r } ), subscribers: subscribers }`

    const result = await session.run(query, {uid: param})

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath)
    session.close()
  } catch (err) {
    next(err)
  }
})

// GET: api/paths/byName/:name
router.get('/byName/:name', async (req, res, next) => {
  try {
    const param = req.params.name

    const query = `
    MATCH (p:Path) WHERE p.name = {name}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {name: param})

    const singlePath = result.records.map(record => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) {
    next(err)
  }
})

// Removes a path's steps
// it takes in the indexes to remove and the last index, otherwise a call will need to be made to check if the last index was removed
// POST: /api/paths/remove/:pathUid/:lastIndex/:stepIndex/
router.post('/remove/:pathUid/:lastIndex/:stepIndex/', async (req, res, next) => {
  try{

    const pathUid   = req.params.pathUid
    const lastIndex = req.params.lastIndex
    const stepIndex = req.params.stepIndex

    console.log('test point 1', pathUid, lastIndex, stepIndex)
    
    if( stepIndex < 1 ||
       stepIndex   > lastIndex) {
        throw new Error('"from" and "to" values are either out of range or the same value!!')
    } else {

        let query = ''
  
        if(stepIndex === lastIndex) {
        //if removing the last index
          query = `  
            MATCH (p:Path {uid:{pUid}})-[:STEPS*` + stepIndex + `]->(stepRem:Step)
            WITH stepRem , p
            MATCH (stepRemP)-[stepRemPE:STEPS]->(stepRem)
            WITH stepRem, stepRemP, p, stepRemPE
            DETACH DELETE stepRemPE, stepRem
          `
        }else{
          query = `  
            MATCH (p:Path {uid:{pUid}})-[:STEPS*` + stepIndex + `]->(stepRem:Step)
            WITH stepRem, p
            MATCH (stepRemP)-[stepRemPE:STEPS]->(stepRem)-[stepRemNE:STEPS]->(stepRemN)
            WITH stepRem, stepRemP, stepRemN, p, stepRemPE, stepRemNE
            DETACH DELETE stepRemPE, stepRemNE, stepRem
            CREATE (stepRemP)-[:STEPS]->(stepRemN)
          `
        }
      
   const queryReturn = `
      WITH p
      MATCH (u:User)-[:PATHS]->(p)
      WITH p, count(distinct u) as subscribers
  
      OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      RETURN { 
        details: p, 
        steps: collect({
          step: s, 
          resource: r }), 
        subscribers: subscribers 
      }
    `

    query += queryReturn
  
    console.log('query is', query)

    const result = await session.run(query, {
       pUid : req.params.pathUid,
    })
  
    const singlePath = result.records.map(record => {
      return record._fields
    })
    
    res.send(singlePath)
    session.close()
    }
  }catch (err) { next(err) }

})

module.exports = router
