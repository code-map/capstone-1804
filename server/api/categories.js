let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()



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

//fuzzy match for any node related to a certain category
router.post('/:categoryName/search', async (req, res, next) => {
  const category = req.params.categoryName
  const { searchString } = req.body
  const query = `MATCH (n)-[:CATEGORY]->(c)
  WHERE c.name = {category} AND toLower(n.name) CONTAINS toLower({searchString})
  return n`
  const response = await session.run(query, {category, searchString})
  const fuzzyMatchByCategory = response.records
  res.json(fuzzyMatchByCategory)
})






module.exports = router


// `MATCH (n)-[:CATEGORY]->(c)
//   WHERE c.name = {category} AND n.name CONTAINS =~ '(?i)searchString.*'
//   return n`
