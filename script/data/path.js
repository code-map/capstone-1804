const dummyPaths =  [
  {
    username : 'Danielle43',
    name : 'Reacting with Confidence',
    image : 'reactWithConfidence.jpg',
    rating : 4.32
  },
  {
    username : 'smarterThanU',
    name : 'how to write a react component',
    image : 'writingComponent.js',
    rating : 1.2
  },
  {
    username : 'abracadabra',
    name : 'React Redux for real',
    image : 'ReactReduxForReal.js',
    rating : 4.2
  },
  {
    username : 'ahowekbl',
    name : 'writing react redirects',
    image : 'writingRedirects.js',
    rating : 3.8
  },
  {
    username : 'Danielle43',
    name : 'Reacting with Confidence',
    image : 'reactWithConfidence.jpg',
    rating : 2.32
  },
  {
    username : 'smarterThanU',
    name : 'how to write a react component',
    image : 'writingComponent.js',
    rating : 3.23
  },
  {
    username : 'abracadabra',
    name : 'React Redux for real',
    image : 'ReactReduxForReal.js',
    rating : 2.53
  },
  {
    username : 'ahowekbl',
    name : 'writing react redirects',
    image : 'writingRedirects.js',
    rating : 3.77
  },
  {
    username : 'Danielle43',
    name : 'Reacting with Confidence',
    image : 'reactWithConfidence.jpg',
    rating : 4.19
  },
  {
    username : 'smarterThanU',
    name : 'how to write a react component',
    image : 'writingComponent.js',
    rating : 3.2
  },
  {
    username : 'abracadabra',
    name : 'React Redux for real',
    image : 'ReactReduxForReal.js',
    rating : 1.2
  },
  {
    username : 'ahowekbl',
    name : 'writing react redirects',
    image : 'writingRedirects.js',
    rating : 4.8
  },
  {
    username : 'Danielle43',
    name : 'Reacting with Confidence',
    image : 'reactWithConfidence.jpg',
    rating : 2.22
  },
  {
    username : 'smarterThanU',
    name : 'how to write a react component',
    image : 'writingComponent.js',
    rating : 3.03
  },
  {
    username : 'abracadabra',
    name : 'React Redux for real',
    image : 'ReactReduxForReal.js',
    rating : 2.83
  },
  {
    username : 'ahowekbl',
    name : 'writing react redirects',
    image : 'writingRedirects.js',
    rating : 4.17
  }
]


const pathsWithIndex = dummyPaths.map((singlePath, index)=>{
  singlePath.id = index
  return singlePath
})

module.exports = pathsWithIndex

