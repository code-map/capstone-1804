let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
//dummy code
const dummyData = require('../../script/data/path.js')
//end of dummy code

router.get('/hello', (req, res, next) => {
  session.run(`match(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
  where p.name='Sequelize Basics'
  return collect({step: properties(s), resource: properties(r)})`).then(result => result.records.forEach(rec => {
  })).then(session.close())
})

// GET /categories/all/parent
router.get(`/all/parent`, async (req, res, next) => {
  try {
    const query = `MATCH (c:Category)
    WHERE c.isLanguage
    return c`

    const result = await session.run(query)

    const categories = result.records.map((record) => {
      return record._fields
    })

    const results = categories.map((category) => {
      return category[0].properties.name
    })

    res.send(results)
    session.close()
  } catch (err) { next(err) }
})


router.get('/:categoryName/popular-paths', async (req,res,next) => {
  const category = req.params.categoryName
  const query = `match(u:User)-[r:PATHS]->(p:Path)-[:CATEGORY]->(c:Category)
      where c.name={category}
      with count(u) as Users,c,p
      optional match(rev:Review)-[:REVIEWS]->(p)
      return c.name as Category, p.name as Path, Users, avg(rev.score) as Rating
      order by Users desc
      limit 3
     `
  const topPathsByCategory = await session.run(query, { category })
  res.json(topPathsByCategory)
})

router.get('/:categoryName/all-paths', async (req,res,next) => {
  const category = req.params.categoryName;
  const query = `MATCH (p:Path)-[:CATEGORY]->(c) WHERE c.name = {category} return p`
  const pathsInCategory = await session.run(query, { category })
  res.send(pathsInCategory)})

//all the resources and paths that have this category
router.get('/:categoryName/search', async(req,res,next) => {
  const category = req.params.categoryName
  const query = `match (p:Path)-[:CATEGORY]->(c) where c.name={category}
  optional match(rev:Review)-[:REVIEWS]->(p)
  RETURN p AS combined, avg(rev.score) as rating
  UNION
  match (r:Resource)-[:CATEGORY]->(c) where c.name={category}
  optional match(rev:Review)-[:REVIEWS]->(r)
  RETURN r AS combined, avg(rev.score) as rating`
  const response = await session.run(query, {category})
  const allPathsAndResourcesByCategory = response.records
  res.json(allPathsAndResourcesByCategory)
})

module.exports = router
