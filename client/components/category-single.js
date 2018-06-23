import React, { Component } from 'react'
import { CategoryAllPaths, CategorySearch, CategoryPopularPaths } from './category'

class CategorySinglePage extends Component {

  render() {
    const categoryId = this.props.match.params.categoryId
    return (
      <div>
        <h1>
          Category Name
        </h1>
        <CategoryPopularPaths categoryId={categoryId} />
        <CategorySearch categoryId={categoryId}/>
        <CategoryAllPaths categoryId={categoryId} />
      </div>
    )
  }
}

export default CategorySinglePage
