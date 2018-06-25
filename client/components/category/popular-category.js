import React from 'react'
import { connect } from 'react-redux'
import { CategoryCard } from './index'
import { getPopularCategoriesThunk } from '../../store'
import Grid from '@material-ui/core/Grid'

class PopularCategories extends React.Component {
  constructor(props){
    super(props)
  }

  async componentDidMount(){
    await this.props.getPopularCategories()
  }

  render() {
    console.log('props inside popularCategories is: ', this.props)
    const popularCategories = this.props.popularCategories
    return( 
      <div>
        <Grid container spacing={40} >
        {
          (popularCategories)
          ? popularCategories.map(cat => 
            <Grid item xs={3} key={cat.id} >
              <CategoryCard 
                key={cat.id} 
                category={cat}
              />
            </Grid>
          ) 
          : null
        }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    popularCategories : state.category.popularCategories,
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    getPopularCategories : () => dispatch(getPopularCategoriesThunk()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(PopularCategories)
