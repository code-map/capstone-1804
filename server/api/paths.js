let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const router = require('express').Router()
const recordsReducer = require('./records-reducer.js')
const shortid = require('shortid')

const makeSlug = (string) => {
  return string.replace(/[^a-z0-9]/gi,'')
}

// GET: api/paths/all/user/:username/
router.get('/all/user/:username/', async (req, res, next) => {
  try {
    const param = req.params.username

    const query = `match(u:User) - [:PATHS*]->(p:Path)
    where u.name = {username}
    return {details: p}`

    const result = await session.run(query, {username: param})

    const paths = result.records.map((record) => {
      return record._fields
    })

    res.send(paths)
    session.close()
  } catch (err) { next(err) }
})

// GET: /api/paths/step/:url
router.get('/step/:url', async (req, res, next) => {
  try {
    const url = decodeURIComponent(req.params.url)

    const query = `
    MATCH (r:Resource) WHERE r.url = {url}
    return r
    `

    const result = await session.run(query, {url})

    if(result.records.length > 0){
      const records = result.records.map((record) => {
        return record._fields
      })
      res.send(records[0][0].properties)
    } else {
      res.send('Not found')
    }

    session.close()
  } catch (err) { next(err) }
})

// returns the most popular paths (regardless of category)
// GET: api/paths/popular
router.get('/popular', async (req,res,next) => {
    const query = `
    MATCH (u: User)-[_p:PATHS]->(p: Path)<-[_r: REVIEWS]-(r:Review),
      (p)-[:CATEGORY]->(c:Category)
      RETURN p.name AS name,
             p.owner AS owner,
             count(r) AS reviewCount,
             count(distinct u) AS userCount,
             avg(r.score) AS rating,
             p.uid AS uid,
             p.slug AS slug,
             c.name AS category
      ORDER BY rating DESC LIMIT 10`
    const result = await session.run(query)

    const reducedResponse = recordsReducer(result.records)
    res.send(reducedResponse)
})


// GET: api/paths/:uid
router.get('/:pathUid', async (req, res, next) => {
  try {
    const param = req.params.pathUid

    const query = `
    MATCH (p:Path) WHERE p.uid = {uid}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

    const result = await session.run(query, {uid: param})

    const singlePath = result.records.map((record) => {
      return record._fields
    })

    res.send(singlePath)
    session.close()
  } catch (err) { next(err) }
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

    const singlePath = result.records.map((record) => {
      return record._fields
    })

    res.send(singlePath[0])
    session.close()
  } catch (err) { next(err) }
})

// GET: api/paths/:uid/user/:username/completed
router.get('/:uid/user/:username/completed', async (req, res, next) => {
  try {
    const uid = req.params.uid
    const username = req.params.username

    const query = `MATCH (u)-[:PATHS]->(p:Path)
    WHERE p.uid = {uid} and u.name = {username}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
    RETURN { steps: collect({ step: s, resource: r, completed: c })}`

    const data = await session.run(query, {uid, username})

    const steps = data.records.map((record) => {
      return record._fields[0].steps
    })

    const completionStatus = steps[0].map((el) => {
      const completed = el.completed !== null
      return {
        stepName: el.resource.properties.name,
        stepUrl:  el.resource.properties.url,
        completed
      }
    })

    res.send(completionStatus)
    session.close()
  } catch (err) { next(err) }
})

// PUT: api/paths/:pathUid/user/:username/status/:bool/step/:stepUrl
router.put('/:pathUid/user/:username/status/:completed/step/:stepUrl', async (req, res, next) => {
  try {

    const uid = req.params.pathUid
    const username = req.params.username
    const stepUrl = decodeURIComponent(req.params.stepUrl)
    const completed = req.params.completed
    let query = ''

    if (completed === 'true') {
      // Remove the relationship
      query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
      OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
      DELETE c
      `
    } else if (completed === 'false'){
      // Add the relationship
      query = `
      MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
      WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
      CREATE (u)-[:COMPLETED]->(s)
      `
    }

    await session.run(query, {uid, username, stepUrl})

    res.send(stepUrl)
    session.close()
  } catch (err) { next(err) }
})

// PUT `/api/paths/${pathUid}/user/${username}/step/${urlEncoded}`
router.post('/:pathUid/user/:username/step/:stepUrl', async (req, res, next) => {
  try {

    const uid = req.params.pathUid
    const username = req.params.username
    const stepUrl = decodeURIComponent(req.params.stepUrl)
    const createdDate = Date.now()
    const newUid = shortid.generate()

    // create the resource if it doesn't exist yet
    if (req.body.type === 'new'){
      const resourceQuery = `
      CREATE (r:Resource { name: {name}, description: {description}, createdDate: {createdDate}, url: {url}, uid: {uid} })
      `
      await session.run(resourceQuery, {
        name: req.body.title,
        description: req.body.description,
        url: stepUrl,
        uid: newUid,
        createdDate
      })
    }

    // Get last step name in path
    const query = `
    MATCH (u:User)-[:PATHS]->(p:Path)
    WHERE p.uid = {uid} AND u.name = {username}
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)
    RETURN s.name
    ORDER BY s.name DESC
    LIMIT 1
    `
    const result = await session.run(query, {uid, username, stepUrl})

    // If there aren't any steps yet, add resource as 'Step 1'
    if(!result.records[0]._fields[0]){
      const addStep1Query = `
      MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
      WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
      CREATE (s:Step { name: "Step 1"}),
      (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
      `
      const addedAsStep1 = await session.run(addStep1Query, {uid, username, stepUrl})

      res.send(addedAsStep1)
    } else {
      // Else get last digit of last existing step and increment new step name
      const lastStepName = result.records[0]._fields[0]
      const newStepNum = lastStepName.substr(lastStepName.indexOf(' '), lastStepName.length - 1)
      const newStepName = `Step ` + ( Number(newStepNum) + 1 )

      const addStepQuery = `
      MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
      WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
      CREATE (s:Step { name: {newStepName} }),
      (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
      `
      const addedNewStep = await session.run(addStepQuery, {uid, username, stepUrl, newStepName})

      res.send(addedNewStep)
    }

  } catch(err) { next(err) }
})

// POST: api/paths/
router.post('/', async (req, res, next) => {

  const createdDate = Date.now()
  const uid = shortid.generate()
  const slug = makeSlug(req.body.name)

  try {

    const newPath = `
    MATCH (u:User), (c:Category)
    WHERE u.name = {username} AND c.name = {category}
    CREATE (p:Path {name: {name}, description: {description}, level: {level}, status: {status}, owner: {username}, createdDate: {createdDate}, uid: {uid}, slug: {slug}}),
    (u)-[:PATHS {notes: {notes}}]->(p),
    (p)-[:CATEGORY]->(c)`

    const created = await session.run(newPath, {
      category: req.body.language,
      username: req.body.user,
      name: req.body.name,
      description: req.body.description,
      level: req.body.level,
      status: 'draft',
      notes: '',
      uid,
      slug,
      createdDate
    })

    const result = [
      { details: { properties: created.summary.statement.parameters } }
    ]

    res.send(result)
    session.close()
  } catch (err) { next(err) }
})

// DELETE: api/paths/:name
router.delete('/:uid', async (req, res, next) => {
  try {
    const uid = req.params.uid

    const query = `
    MATCH (p:Path) WHERE p.uid = {uid}
    DETACH DELETE p`

    await session.run(query, {uid})

    res.send(uid)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router














// let neo4j = require('neo4j-driver').v1;
// let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// let session = driver.session();
// const router = require('express').Router()
// const recordsReducer = require('./records-reducer.js')
// const shortid = require('shortid')

// const makeSlug = (string) => {
//   return string.replace(/[^a-z0-9]/gi,'')
// }

// // GET: api/paths/all/user/:username/
// router.get('/all/user/:username/', async (req, res, next) => {
//   try {
//     const param = req.params.username

//     const query = `match(u:User) - [:PATHS*]->(p:Path)
//     where u.name = {username}
//     return {details: p}`

//     const result = await session.run(query, {username: param})

//     const paths = result.records.map((record) => {
//       return record._fields
//     })

//     res.send(paths)
//     session.close()
//   } catch (err) { next(err) }
// })

// // GET: /api/paths/step/:url
// router.get('/step/:url', async (req, res, next) => {
//   try {
//     const url = decodeURIComponent(req.params.url)

//     const query = `
//     MATCH (r:Resource) WHERE r.url = {url}
//     return r
//     `

//     const result = await session.run(query, {url})

//     if(result.records.length > 0){
//       const records = result.records.map((record) => {
//         return record._fields
//       })
//       res.send(records[0][0].properties)
//     } else {
//       res.send('Not found')
//     }

//     session.close()
//   } catch (err) { next(err) }
// })

// // returns the most popular paths (regardless of category)
// // GET: api/paths/popular
// router.get('/popular', async (req,res,next) => {
//     const query = `
//     MATCH (u: User)-[_p:PATHS]->(p: Path)<-[_r: REVIEWS]-(r:Review),
//       (p)-[:CATEGORY]->(c:Category)
//       RETURN p.name AS name,
//              p.owner AS owner,
//              count(r) AS reviewCount,
//              count(distinct u) AS userCount,
//              avg(r.score) AS rating,
//              p.uid AS uid,
//              p.slug AS slug,
//              c.name AS category
//       ORDER BY rating DESC LIMIT 10`
//     const result = await session.run(query)

//     const reducedResponse = recordsReducer(result.records)
//     res.send(reducedResponse)
// })


// // GET: api/paths/:uid
// router.get('/:pathUid', async (req, res, next) => {
//   try {
//     const param = req.params.pathUid

//     const query = `
//     MATCH (p:Path) WHERE p.uid = {uid}
//     OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
//     RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

//     const result = await session.run(query, {uid: param})

//     const singlePath = result.records.map((record) => {
//       return record._fields
//     })

//     res.send(singlePath)
//     session.close()
//   } catch (err) { next(err) }
// })


// // GET: api/paths/byName/:name
// router.get('/byName/:name', async (req, res, next) => {
//   try {
//     const param = req.params.name

//     const query = `
//     MATCH (p:Path) WHERE p.name = {name}
//     OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
//     RETURN { details: p, steps: collect( { step: s, resource: r } ) }`

//     const result = await session.run(query, {name: param})

//     const singlePath = result.records.map((record) => {
//       return record._fields
//     })

//     res.send(singlePath[0])
//     session.close()
//   } catch (err) { next(err) }
// })

// // GET: api/paths/:uid/user/:username/completed
// router.get('/:uid/user/:username/completed', async (req, res, next) => {
//   try {
//     const uid = req.params.uid
//     const username = req.params.username

//     const query = `MATCH (u)-[:PATHS]->(p:Path)
//     WHERE p.uid = {uid} and u.name = {username}
//     OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
//     OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
//     RETURN { steps: collect({ step: s, resource: r, completed: c })}`

//     const data = await session.run(query, {uid, username})

//     const steps = data.records.map((record) => {
//       return record._fields[0].steps
//     })

//     const completionStatus = steps[0].map((el) => {
//       const completed = el.completed !== null
//       return {
//         stepName: el.resource.properties.name,
//         stepUrl:  el.resource.properties.url,
//         completed
//       }
//     })

//     res.send(completionStatus)
//     session.close()
//   } catch (err) { next(err) }
// })

// // PUT: api/paths/:pathUid/user/:username/status/:bool/step/:stepUrl
// router.put('/:pathUid/user/:username/status/:completed/step/:stepUrl', async (req, res, next) => {
//   try {

//     const uid = req.params.pathUid
//     const username = req.params.username
//     const stepUrl = decodeURIComponent(req.params.stepUrl)
//     const completed = req.params.completed
//     let query = ''

//     if (completed === 'true') {
//       // Remove the relationship
//       query = `
//       MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
//       WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
//       OPTIONAL MATCH (u)-[c:COMPLETED]->(s)
//       DELETE c
//       `
//     } else if (completed === 'false'){
//       // Add the relationship
//       query = `
//       MATCH (u:User)-[:PATHS]->(p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
//       WHERE u.name = {username} and p.uid = {uid} and r.url = {stepUrl}
//       CREATE (u)-[:COMPLETED]->(s)
//       `
//     }

//     await session.run(query, {uid, username, stepUrl})

//     res.send(stepUrl)
//     session.close()
//   } catch (err) { next(err) }
// })

// // PUT `/api/paths/${pathUid}/user/${username}/step/${urlEncoded}`
// router.post('/:pathUid/user/:username/step/:stepUrl', async (req, res, next) => {
//   try {

//     const uid = req.params.pathUid
//     const username = req.params.username
//     const stepUrl = decodeURIComponent(req.params.stepUrl)
//     const createdDate = Date.now()
//     const newUid = shortid.generate()

//     // create the resource if it doesn't exist yet
//     if (req.body.type === 'new'){
//       const resourceQuery = `
//       CREATE (r:Resource { name: {name}, description: {description}, createdDate: {createdDate}, url: {url}, uid: {uid} })
//       `
//       await session.run(resourceQuery, {
//         name: req.body.title,
//         description: req.body.description,
//         url: stepUrl,
//         uid: newUid,
//         createdDate
//       })
//     }

//     // Get last step name in path

//     const query = `
//     MATCH (u:User)-[:PATHS]->(p:Path)
//     WHERE p.uid = {uid} AND u.name = {username}
//     OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)
//     RETURN s.name
//     ORDER BY s.name DESC
//     LIMIT 1
//     `
//     const result = await session.run(query, {uid, username, stepUrl})

//     // If there aren't any steps yet, add resource as 'Step 1'
//     if(!result.records[0]._fields[0]){
//       const addStep1Query = `
//       MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
//       WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
//       CREATE (s:Step { name: "Step 1"}),
//       (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
//       `
//       const addedAsStep1 = await session.run(addStep1Query, {uid, username, stepUrl})

//       res.send(addedAsStep1)
//     } else {
//       // Else get last digit of last existing step and increment new step name
//       const lastStepName = result.records[0]._fields[0]
//       const newStepNum = lastStepName.substr(lastStepName.indexOf(' '), lastStepName.length - 1)
//       const newStepName = `Step ` + ( Number(newStepNum) + 1 )

//       const addStepQuery = `
//       MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
//       WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
//       CREATE (s:Step { name: {newStepName} }),
//       (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
//       `
//       const addedNewStep = await session.run(addStepQuery, {uid, username, stepUrl, newStepName})



//         res.send(addedNewStep)

//     }
//   } catch(err) { next(err) }
// })

// // POST: api/paths/
// router.post('/', async (req, res, next) => {

//   const createdDate = Date.now()
//   const uid = shortid.generate()
//   const slug = makeSlug(req.body.name)

//   try {

//     const newPath = `
//     MATCH (u:User), (c:Category)
//     WHERE u.name = {username} AND c.name = {category}
//     CREATE (p:Path {name: {name}, description: {description}, level: {level}, status: {status}, owner: {username}, createdDate: {createdDate}, uid: {uid}, slug: {slug}}),
//     (u)-[:PATHS {notes: {notes}}]->(p),
//     (p)-[:CATEGORY]->(c)`

//     const created = await session.run(newPath, {
//       category: req.body.language,
//       username: req.body.user,
//       name: req.body.name,
//       description: req.body.description,
//       level: req.body.level,
//       status: 'draft',
//       notes: '',
//       uid,
//       slug,
//       createdDate
//     })

//     const result = [
//       { details: { properties: created.summary.statement.parameters } }
//     ]

//     res.send(result)
//     session.close()
//   } catch (err) { next(err) }
// })

// // DELETE: api/paths/:name
// router.delete('/:uid', async (req, res, next) => {
//   try {
//     const uid = req.params.uid

//     const query = `
//     MATCH (p:Path) WHERE p.uid = {uid}
//     DETACH DELETE p`

//     await session.run(query, {uid})

//     res.send(uid)
//     session.close()
//   } catch (err) { next(err) }
// })


// //copy existing path
// //create path
// //that belongs to the new user
// //take each step for each and attach the matching resource for each

// // router.post('/:uid/:slug/copy', (req, res, next) => {
// //   try {
// //     //point the user to the actual path
// //     //make the steps on the new user's copy and point to the same resources
// //     //update the source path to update the related paths when a new resource is added
// //     const { userUid, pathUid } = req.body

// //     const query = `MATCH (p:Path) WHERE p.uid = {pathUid}
// //     OPTIONAL MATCH (r:Resource)-[:STEP]->(p)
// //     CREATE (u:User {uid: userUid})-[:FOLLOWS]->(p)
// //     RETURN r`

// //     const copyPathAndReturnResources = await session.run(query, {userUid, pathUid})
// //     //strip this object
// //     console.log('RESOURCES RETRUNED', copyPathAndReturnResources)
// //     //const resources = order the resources by the step numbers
// //         //const duplicatePathSteps = resources.map((resource) => {
// //           //for each resource in the step/resources array run the following query or similar:

// //               //     const addStepQuery = `
// //               // MATCH (u:User)-[:PATHS]->(p:Path), (r:Resource)
// //               // WHERE p.uid = {uid} AND u.name = {username} AND r.url = {stepUrl}
// //               // CREATE (s:Step { name: {newStepName} }),
// //               // (p)-[:STEPS]->(s)-[:RESOURCE]->(r)
// //               // `

// //           //return await session.run(addStepQuery, {uid, stepUrl, newStepName, username: user.username})
// //         //})

// //         //return the link of the path with the follow tag and user and steps - return a path with the edit options turned off


// //   }catch(err) {
// //     console.error(err)
// //     next(err)
// //   }
// // })

// module.exports = router


//  //find all subscribers of the path
//       //const findSubscribersQuery = `MATCH (u:User)-[:FOLLOWS]->(p:Path {uid}) RETURN u.uid AS userId`
//       //const pathFollowers = await session.run(findSubscribersQuery, {uid})

//       //if there are followers, update their path steps to match the public one
//       //if(pathFollowers.length){
//         //find resources with steps
//         //MATCH (p:Path)-[:STEPS]->(s)-[:RESOURCE]->(r) RETURN r, s
//         //destructure the object into an array of key/value pairs of resources with step name
//         //order the resources by the step numbers???
//         //const addedNewStepForPathFollowers = pathFollowers.map((user) => {
//           //console.log('PATH FOLLOWERS!!!', pathFollowers)
//           //for each resources in the step/resources array run the following query
//           //return await session.run(addStepQuery, {uid, stepUrl, newStepName, username: user.username})
//         //})
//         //res.send(addedNewStepForPathFollowers, addedNewSteps)
