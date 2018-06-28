let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
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
    MATCH (r:Resource)
    WHERE toLower(r.name) CONTAINS toLower({searchString})
    RETURN r AS matches`
    const response = await session.run(query, {searchString})
    const fuzzyMatch = response.records
    //console.log('FUZZY', fuzzyMatch)
    res.json(fuzzyMatch)
  }catch(err){
    next(err)
  }
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
