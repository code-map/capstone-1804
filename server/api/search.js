let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()


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


module.exports = router
