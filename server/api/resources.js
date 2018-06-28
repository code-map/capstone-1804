let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')

router.get('/:resourceUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    const query = `
    MATCH (r:Resource) WHERE r.uid = {uid}
    RETURN r`

    const result = await session.run(query, {uid: param})

    const singleRecord = result.records.map((record) => {
      return record._fields
    })

    res.send(singleRecord)
    session.close()

  }catch(err){
    console.error(err)
    next(err)
  }

})

module.exports = router


