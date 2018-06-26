import React, { Component } from 'react'
import { CategoryAllPaths, CategorySearch, CategoryPopularPaths } from './'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { createGetSingleCategoryThunk } from '../../store'


class CategorySinglePage extends Component {
  constructor(){
    super()
  }

  async componentDidMount(){
    const { categoryName } = this.props.match.params
    const stuff = await this.props.getAllItemsInCategory(categoryName)
  }




  render() {
    console.log('props', this.props.categoryItems)
    const { paths, resources, name } = this.props.categoryItems
    if(paths.length) {
      return(
        <div>
          <h1>{name}</h1>
          <CategoryAllPaths paths={paths}/>
        </div>
      )
    }else{
      return <p>loading</p>
    }
    // const categoryName = this.props.match.params.categoryName
    // return (
    //   <div>
    //     <h1>
    //       {categoryName}
    //     </h1>
    //     <CategoryPopularPaths categoryId={categoryId} />
    //     <CategorySearch categoryId={categoryId}/>
    //   </div>
//    )
  }
}


const mapState = (state) => {
  console.log('state', state)
  return({
    categoryItems: state.singleCategory
  })
}

const mapDispatch = (dispatch) => {
  return({
    getAllItemsInCategory : (categoryName) => {
      return dispatch(createGetSingleCategoryThunk(categoryName))
    }
  })
}

export default connect(mapState, mapDispatch)(CategorySinglePage)





