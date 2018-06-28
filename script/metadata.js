const scrape = require('html-metadata')
let neo4j = require('neo4j-driver').v1
let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234'))
let session = driver.session()

const getMetadata = url => {
  let metaObj = {}

  scrape(url)
    .then(metadata => {
      const data = metadata.openGraph

      if (!data) {
        throw new Error('No metadata found')
      } else {
        metaObj.title = data.title ? data.title : ''
        metaObj.type = data.type ? data.type : ''
        metaObj.description = data.description ? data.description : ''
        metaObj.imageUrl = data.image ? data.image.url : ''

        return metaObj
      }
    })
    .catch(err => {
      console.error(err.message)
      return `could not retrieve metadata for ${url}`
    })
}

const updateSeed = async () => {
  let data = await session.run(`
    MATCH (r:Resource)
    RETURN collect(r.url)
  `)
  let urls = data.records[0]._fields[0]
  urls.forEach(url => {
    scrape(url)
      .then(metadata => {
        let metaObj = {}
        data = metadata.openGraph

        if (!data) {
          throw new Error('No metadata found')
        } else {
          metaObj.title = data.title ? data.title : ''
          metaObj.type = data.type ? data.type : ''
          metaObj.description = data.description ? data.description : ''
          metaObj.imageUrl = data.image ? data.image.url : ''

          session.run(
            `
        MATCH (r:Resource)
        WHERE r.url = {url}
        SET r.name = {name}, r.type = {type}, r.description = {description}, r.imageUrl = {imageUrl}
      `,
            {
              url: url,
              type: metaObj.type,
              name: metaObj.title,
              description: metaObj.description,
              imageUrl: metaObj.imageUrl
            }
          )
        }
      })
      .catch(err => {
        console.error(url, ' -------', err.message)
      })
  })
}

module.exports = {getMetadata, updateSeed}
