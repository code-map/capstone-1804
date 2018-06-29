// NOTE: THESE TESTS ASSUME DB IS ALREADY SEEDED!

const chai = require('chai');
const expect = chai.expect;
// const chaiThings = require('chai-things');
// chai.use(chaiThings);
let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const app = require('../../../server/index.js');
const agent = require('supertest')(app);
const fs = require('fs')

describe('Categories API Routes', () => {
  before(async () => {
    //re-seed db?
  })

  describe('GET api/categories/all/parent', () => {
    it('returns all language categories', async () => {
      const response = await agent.get('/categories/all/parent')
      .expect(200)

      fs.writeFile('./response.txt', response)
      console.log(response)
      console.log(JSON.parse(response.text))
    })
  })

  describe('/:categoryName/popular-paths', () => {
    it('returns the correct paths and other info', async () => {
      const response = await agent.get('/Javascript/popular-paths')
      .expect(200)
    })
  })

  describe('/:categoryName/search', () => {
    it('returns all resources and paths within queried category', async () => {
      const response = await agent.get('/Javascript/search')
      .expect(200)
    })
  })

  describe('/popular', () => {
    it('returns the most popular categories, ordered by number of users', async () => {
      const response = await agent.get('/popular')
      .expect(200)
    })
  })
})
