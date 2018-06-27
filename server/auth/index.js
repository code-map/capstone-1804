const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router
const crypto = require('crypto')

let neo4j = require('neo4j-driver').v1
let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
let session = driver.session()

router.post('/signup', async (req, res, next) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const salt = crypto.randomBytes(16).toString('base64')
    const pass = crypto
      .createHash('RSA-SHA256')
      .update(req.body.password)
      .update(salt)
      .digest('hex')

    const query = `
    CREATE (newuser:User {name: {name}, email: {email}, password: {password}, googleId: '', createdDate: timestamp(), isAdmin: false, salt: {salt}})
    RETURN newuser
  `

    const response = await session.run(query, {
      name: name,
      email: email,
      password: pass,
      salt: salt
    })

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
  try {
    const name = req.body.name
    const pass = req.body.password

    //check if user exists
    let query = `
    MATCH (u:User)
    WHERE u.name = {name}
    RETURN u
  `

    let response = await session.run(query, {name: name})
    let user = response.records[0]._fields[0].properties


    //if the pw is salted in the database
    if (user.salt) {
      const saltedPW = crypto
        .createHash('RSA-SHA256')
        .update(pass)
        .update(user.salt)
        .digest('hex')

      query = `MATCH (u:User)
        WHERE u.name = {name} and u.password = {pw}
        RETURN properties(u)
      `
      response = await session.run(query, {name: name, pw: saltedPW})
    } else {
      // seed file user without salted pw
      query = `MATCH (u:User)
        WHERE u.name = {name} and u.password = {pw}
        RETURN properties(u)
      `
      response = await session.run(query, {name: name, pw: pass})
    }

    user = response.records[0]._fields[0]
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    res.status(401).send('Wrong username or password')
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
