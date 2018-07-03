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

// Reorders a path's steps
// it takes in the indexes to move: from, to
// POST: /api/paths/reorder/:stepCount/:uid/:fromIndex/:toIndex
router.post('/reorder/:pathUid/:stepCount/:fromIndex/:toIndex', async (req, res, next) => {
  try{
    const from   = req.params.fromIndex
    const to     = req.params.toIndex
    const lastIndex = req.params.stepCount
    
    if(from === to || 
       from < 1 ||
       to   < 1 ||
       from > lastIndex ||
       to   > lastIndex) {
        throw new Error('"from" and "to" values are either out of range or the same value!!')
    } else {

        let query = ''
  
        if(from < to) {
          //moving from top down
          if(to === lastIndex) {
            //if moving TO the last index
            query = `  
              MATCH (p:Path {uid : {pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)
              DELETE fromPE, fromNE
              CREATE (fromP)-[:STEPS]->(fromN), (toC)-[:STEPS]->(fromC)
            `
          } else{
            query = `  
              MATCH (p:Path {uid : {pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, fromNE, toNE
              CREATE (fromP)-[:STEPS]->(fromN), (toC)-[:STEPS]->(fromC)-[:STEPS]->(toN)
            ` 
          }
        }else{
          //moving from bottom up
          if(from === lastIndex) {
          //if moving FROM the last index
            query = `  
              MATCH (p:Path {uid:{pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)
              WITH fromC, fromP, p, fromPE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH fromC, fromP, p, fromPE, toC 
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, toPE
              CREATE (toP)-[:STEPS]->(fromC)-[:STEPS]->(toC) 
            `
          }else{
            query = `  
              MATCH (p:Path {uid:{pUid}})-[:STEPS*` + from + `]->(fromC:Step)
              WITH fromC, p
              MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
              WITH fromC, fromP, fromN, p, fromPE, fromNE
              MATCH (p)-[:STEPS*` + to + `]->(toC:Step)
              WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
              MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
              DELETE fromPE, fromNE, toPE
              CREATE (fromP)-[:STEPS]->(fromN), (toP)-[:STEPS]->(fromC)-[:STEPS]->(toC) 
            `
          }
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
