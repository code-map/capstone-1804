let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
const apoc = require('apoc')
const shortid = require('shortid');


router.post('/search', async (req, res, next) => {
  try{
    const {searchString} = req.body
    const query = `MATCH (n)
    WHERE toLower(n.name) CONTAINS toLower({searchString})
    return n`
    const response = await session.run(query, {searchString})
    const fuzzyMatch = response.records
    res.json(fuzzyMatch)
  }catch(err){
    next(err)
  }
})

router.put('/', async (req, res, next) => {
    var randomId = shortid.generate()
    const query = `MATCH p = (n)-[*]->(END)
    FOREACH (n IN nodes(p) | SET n.test={randomId})`
    const response = await session.run(query, {randomId()})
    res.json(response.records)
})


module.exports = router
