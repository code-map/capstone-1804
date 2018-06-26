import React from 'react'
import { PopularCategories, CategorySearch } from './category'
import { PopularPaths } from './paths'

const HomePage = () => {
  return(
    <div>
      <h1>
        What do you want to learn today?
      </h1>
      <CategorySearch />
      <h3>
        Popular Topics:
      </h3>
      <PopularCategories />
      <h3>
        Popular Paths:
      </h3>
      <PopularPaths />
    </div>
  )
}

export default HomePage
