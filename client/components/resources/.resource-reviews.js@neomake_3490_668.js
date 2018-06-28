import React from 'react'
import {connect} from 'react-redux'
import {ReviewCard} from '../reviews'
import {getAllReviewsOfResource} from '../../store'


class ResourceReviews extends React.Component{
  constructor(){
    super()
  }

  async componentWillMount() {
    await this.props.getResourceReviews(this.props.resourceName)
  }

  render(){
    return(
      <div>
        reviews:
        {this.props.reviews.map(rev => {
            console.log('rev is ', rev)
            return(
              <div >
                <ReviewCard 
                  author={rev.author}
                  score={rev.score.low}
                  comments={rev.comments}
                />
              </div>
            )
          })
        }
        <p>
          add review
        </p>
      </div>
    )
  }
}

const mapState = (state) => {
  return({
    reviews: state.resource.reviews
  })
}

const mapDispatch = (dispatch) => {
  return({
    getResourceReviews : (resourceName) => {
      dispatch(getAllReviewsOfResource(resourceName))
    }
  })
}

export default connect(mapState,mapDispatch)(ResourceReviews)
