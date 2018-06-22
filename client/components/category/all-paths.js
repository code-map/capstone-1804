import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import  Grid from '@material-ui/core/Grid'
import { getAllPathsInCategory } from '../../store'
import { PathCardSmall } from '../path'

class CategoryAllPaths extends React.Component {
  constructor(){
    super()
  }

  async componentDidMount(){
    const categoryId = this.props.categoryId
    await this.props.getAllPathsInCategory(categoryId)
  }

  render() {
    const paths = this.props.paths
    return(
      <div>
        <Grid container spacing={40}>
          {paths.map((path) => 
            <Grid item xs={6}>
              <PathCardSmall
                key = {path.id}
                id = {path.id}
                imagePath={path.image}
                name={path.name} 
                username={path.username} 
                rating={path.rating}
              />
            </Grid>
          )}
        </Grid>
      </div>
    )
  }
}

const mapState = (state) => {
  return({
    paths: state.pathReducer.allPathsInCategory
  })
}

const mapDispatch = (dispatch) => {
  return({
    getAllPathsInCategory : (categoryId) => {
      return dispatch(getAllPathsInCategory(categoryId))
    }
  })
}

export default connect(mapState, mapDispatch)(CategoryAllPaths)
