//Cool queries!

// All paths and related info for user
match(a:User {name:'Mary'})-[:PATHS]->(p:Path)-[*]->(s:Step)-[:RESOURCE]->(r:Resource)
optional match (r)-[*]-(z:Review)
return p,s,r,z

//All paths in a category
match(c:Category {name: 'Data'})<-[:CATEGORY]-(p:Path)
return p

//All resources in a category
match(c:Category {name: 'Data'})<-[:CATEGORY]-(r:Resource)
return r

//Paths in a category, with reviews attached
match(c:Category {name:'Data'})<-[:CATEGORY*]-(p:Path)
with p
optional match (rev:Review)-[:REVIEWS*]-> (p)
return p, rev

//Resources in a category with reviews attached
match(c:Category {name: 'Data'})-[:CATEGORY]-(r:Resource)
match (r)-[*]-(z:Review)
return r, z

//Get a single resource by name
match(r:Resource {name: 'Data Science Toolkit'}) return r




//top 5 paths by review score
match (p:Path)<-[:REVIEWS]-(rev:Review)
return p.name as Path, count(rev) as Reviews, avg(rev.score) as Rating
order by Rating desc
limit 5

//find the top 3 paths ordered by number of connected users, with review score
//will not return paths without reviews!
match(u:User)-[r:PATHS]->(p:Path)<-[:REVIEWS]-(rev:Review)
return p as Path, count(distinct u) as Users, avg(rev.score)
order by Users desc
limit 3


//find the top 3 paths ordered by number of connected users, with review score
//includes a list of languages, taken from the resources in each path
// I think this works...need better data
match (u:User)-[r:PATHS]->(p:Path)
with count(u) as Users, p
optional match (p)<-[:REVIEWS]-(rev:Review)
with Users, p, avg(rev.score) as Rating
optional match (p)-[:STEPS*]->(:Step)-[:RESOURCE*]->(res:Resource)-[:CATEGORY*]->(cats:Category {isLanguage:true})
return p, Users, Rating, collect(distinct cats.name) as Languages
order by Users desc
limit 3

//find the top 3 categories, ordered by number of users
//count is based on users connected to a path.  Do we want to count that, or those connected only to a category?
match(u:User)-[r:PATHS]-(p:Path)-[:CATEGORY]-(c:Category)
where c.isLanguage=true //include this to show only languages
return c as Category, count(u) as Users //or count(distinct u)
order by count(u) desc
limit 3


//find resources in a given category, ordered by number of connected users


//Top 3 paths for a given category with average rating, ordered by number of users
match(u:User)-[r:PATHS]->(p:Path)-[:CATEGORY]->(c:Category)
where c.name='React'
with count(u) as Users,c,p
optional match(rev:Review)-[:REVIEWS]->(p)
return c.name as Category, p.name as Path, Users, avg(rev.score) as Rating
order by Users  desc
limit 3

//All steps of a given path, with review score
//connects to row 2 of API Call Wishlist
match (p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(res:Resource)
where p.name='All About React'
optional match (p)<-[:REVIEWS]-(rev:Review)
return p.name as PathName, s as Step, res.name, avg(rev.score) as Rating
order by Step.name asc


//All paths from a given category, sorted by number of users subscribed to path
//connects row 3
match (c:Category)<-[:CATEGORY]-(p:Path)<-[:PATHS]-(u:User)
where c.name='React'
optional match (p)<-[:REVIEWS]-(rev:Review)
return  c.name as Category, p as Path, count(distinct u) as Users, coalesce(avg(rev.score), -1) as Rating
order by Rating desc
