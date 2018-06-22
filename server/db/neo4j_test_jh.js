let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();

session.run(`match (p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(res:Resource)
where p.name='All About React'
optional match (p)<-[:REVIEWS]-(rev:Review)
return p.name as PathName, s as Step, res.name, avg(rev.score) as Rating
order by Step.name asc`).then((result)=> console.log(result.records)).then(session.close())
