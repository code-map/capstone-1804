import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { getPopularPathsInCategory } from '../../store'
import { PathCard } from '../path'
import Grid from '@material-ui/core/Grid'

const styles = {
  container: {
    padding: 20
  }
}

const mapState = (state) => {
  return({
    paths: state.pathReducer.popularPathsInCategory
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
  }

  async componentDidMount(){
    const categoryId = this.props.categoryId
    await this.props.getPopularPathsInCategory(categoryId)
  }

  render() {
    const paths = this.props.paths
    console.log('paths are: ', paths)
    return (
      <div style={styles.container} >
        <Grid container spacing={40} >
          {paths.map((path) => 
            <Grid item xs={3} key={path.id} >
            <PathCard 
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

export default connect(mapState, mapDispatch)(CategoryPopularPaths)
