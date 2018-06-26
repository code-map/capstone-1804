const dummyCategories =  [
  {
    name : 'React',
  },
  {
    name : 'Javascript',
  },
  {
    name : 'Sequelize',
  },
  {
    name : 'D3',
  },
  {
    name : 'callback Functions',
  },
  {
    name : 'Express',
  },
  {
    name : 'Redux',
  },
]

const categoriesWithProps = dummyCategories.map((singleCat, index)=>{
  singleCat.id = index
  singleCat.popularity = Math.floor(Math.random() * Math.floor(3000))
  return singleCat
})

module.exports = categoriesWithProps

