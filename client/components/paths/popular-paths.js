import React from 'react'
import { connect } from 'react-redux'
import { getPopularPathsInAllCategories } from '../../store'
import { PathCard } from './index'
import Grid from '@material-ui/core/Grid'

class PopularPaths extends React.Component {
  constructor(props){
    super(props)
  }

  async componentDidMount(){
    await this.props.getPopularPaths()
  }

  render() {
    const popularPaths = this.props.popularPaths
    return( 
      <div>
        <Grid container spacing={40}>
        {
          (popularPaths)
          ? popularPaths.map(path => 
              <Grid item xs={3} key={path.name}>
                <PathCard
                  reviewCount={path.reviewCount.low}
                  userCount={path.userCount.low}
                  name={path.name}
                  owner={path.owner}
                  rating={path.rating}
                /> 
              </Grid>
            )
          : <p> no paths found </p>
        }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    popularPaths : state.pathReducer.popularPathsInAllCategories,
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    getPopularPaths : () => dispatch(getPopularPathsInAllCategories()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(PopularPaths)
