const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router

let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();

router.post('/signup', async (req, res, next) => {
  try {

    const name = req.body.name
    const email = req.body.email
    const pass = req.body.password

    console.log('in route: name', name, 'email', email, 'pass', pass)
    const query = `
    CREATE (newuser:User {name: {name}, email: {email}, password: {password}, googleId: '', createdDate: timestamp(), isAdmin: false, id: 2})
    RETURN newuser
  `

    const response = await session.run(query, {name: name, email: email, password: pass})
    console.log('user coming back from db', response.records[0]._fields[0].properties)

    const user = response.records[0]._fields[0].properties
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/login', async (req, res, next) => {
  try{

  const name = req.body.name
  const pass = req.body.password

  const query = `
    MATCH (u:User)
    WHERE u.name = {name} and u.password = {password}
    RETURN properties(u)
  `

  const response = await session.run(query, {name: name, password: pass})
  console.log('response in login route', response.records[0]._fields[0])
  const user = response.records[0]._fields[0]
  console.log('user in login route', user)
  req.login(user, err => (err ? next(err) : res.json(user)))


} catch (err) {
  res.status(401).send('Wrong username or password')
}
  // const user = await User.findOne({where: {email: req.body.email}})
  // if (!user) {
  //   console.log('No such user found:', req.body.email)
  //   res.status(401).send('Wrong username and/or password')
  // } else if (!user.correctPassword(req.body.password)) {
  //   console.log('Incorrect password for user:', req.body.email)
  //   res.status(401).send('Wrong username and/or password')
  // } else {
  //   req.login(user, err => (err ? next(err) : res.json(user)))
  // }
})

// router.post('/signup', async (req, res, next) => {
//   try {
//     const user = await User.create(req.body)
//     req.login(user, err => (err ? next(err) : res.json(user)))
//   } catch (err) {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(401).send('User already exists')
//     } else {
//       next(err)
//     }
//   }
// })

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
