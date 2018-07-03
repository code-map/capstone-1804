// let neo4j = require('neo4j-driver').v1;
// let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// let session = driver.session();
let session = require('../db/neo')

const router = require('express').Router()
const apoc = require('apoc')
const shortid = require('shortid');

router.post('/', async (req, res, next) => {
  try{
    const {searchString} = req.body
    const query = `MATCH (p:Path)
    WHERE toLower(p.name) CONTAINS toLower({searchString})
    RETURN p AS matches
    UNION
    MATCH (c:Category)
    WHERE toLower(c.name) CONTAINS toLower({searchString})
    RETURN c AS matches`
    const response = await session.run(query, {searchString})
    const fuzzyMatch = response.records
    //console.log('FUZZY', fuzzyMatch)
    res.json(fuzzyMatch)
  }catch(err){
    next(err)
  }
})


router.get('/:uid/category', async (req, res, next) => {
  const {uid} = req.params

  const query= `
  MATCH (p:Path)-[:CATEGORY]->(c)
  WHERE p.uid = {uid}
  RETURN c
  `
  const { records } = await session.run(query, {uid})

  res.json(records)


})

// router.put('/', async (req, res, next) => {
//     var randomId = shortid.generate()
//     const query = `MATCH p = (n)-[*]->(END)
//     FOREACH (n IN nodes(p) | SET n.test={randomId})`
//     const response = await session.run(query, {randomId()})
//     res.json(response.records)
// })


module.exports = router


// `MATCH (n)
//     WHERE toLower(n.slug) CONTAINS toLower({searchString})
//     return n`
