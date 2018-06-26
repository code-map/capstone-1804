import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { getPopularPathsInCategory, createGetSingleCategoryThunk } from '../../store'
import { PathCard } from '../paths'
import Grid from '@material-ui/core/Grid'

//to differentiate this component from /paths/popular-paths.js, 
//these only bring in the popular paths of a specific category

const styles = {
  container: {
    padding: 20
  }
}

const mapState = (state) => {
  return({
    paths: state.singleCategory
  })
}

const mapDispatch = (dispatch) => {
  return({
    getEverythingForCategory : (categoryName) => {
      return dispatch(createGetSingleCategoryThunk(categoryName))
    }
  })
}

class CategoryPopularPaths extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount(){
    const categoryName = this.props.categoryName
    await this.props.getEverythingForCategory(categoryName)
  }

  render() {
    const paths = this.props.paths
    return (
      <div style={styles.container} >
        <Grid container spacing={40} >
          {/* {paths.map((path) =>
            <Grid item xs={3} key={path.id} >
            <PathCard
              imagePath={path.image}
              name={path.name}
              username={path.username}
              rating={path.rating}
            />
            </Grid>
          )} */}
        </Grid>
      </div>
    )
  }
}

export default connect(mapState, mapDispatch)(CategoryPopularPaths)
