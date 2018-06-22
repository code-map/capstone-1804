import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { getPopularPathsInCategory } from '../../store'
import { PathCard } from '../path'

const mapState = (state) => {
  return({
    paths: state.category.popularPaths
  })
}

const mapDispatch = (dispatch) => {
  return({
    getPopularPathsInCategory : (categoryId) => {
      return dispatch(getPopularPathsInCategory(categoryId))
    }
  })
}

class CategoryPopularPaths extends React.Component {
  constructor(props) {
    super(props)
  //this.state = {
  //  popularPaths : [],
  //}
  }

  async componentDidMount(){
    const categoryId = this.props.categoryId
    await this.props.getPopularPathsInCategory(categoryId)
//  this.setState({
//    popularPaths: [{image : '123', name: '2223', username : 'abl', rating: '12331'}]
//  })
    //console.log('poppaths = ',  this.state.category.popularPaths)
  }

  render() {
    console.log('this is: ', this)
    const paths = this.props.paths
    return (
      <div>
        <h1> Popular Paths Placeholder </h1>
        {paths.map((path) => 
          <PathCard 
            imagePath={path.image}
            name={path.name} 
            username={path.username} 
            rating={path.rating}
          />
        )}
      </div>
    )
  }
}

export default connect(mapState, mapDispatch)(CategoryPopularPaths)
