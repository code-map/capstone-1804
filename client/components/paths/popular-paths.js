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
    console.log('props inside popularPaths is: ', this.props)
    const popularPaths = this.props.popularPaths
    return( 
      <div>
        <Grid container spacing={40}>
        {
          (popularPaths)
          ? popularPaths.map(path => 
              <Grid item xs={3} key={path.id}>
                <PathCard
                  id={path.id}
                  imagePath={path.image}
                  name={path.name}
                  username={path.username}
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
