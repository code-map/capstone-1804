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

  async componentWillUnmount() {
    //placeholder.  
    //when this unmounts the review for the current resource should be removed from state
  }

  render(){
    console.log('this.props is: ', this.props)
    const resName = this.props.resourceNams
    console.log('this.props.resourceName is: ', resName)
    console.log('this.props.reviews[resourceName] is: ', this.props.reviews[resName])
    const reviews = this.props.reviews[this.props.resourceName] ?
      this.props.reviews[this.props.resourceName] :
      undefined
    console.log('reviews are => ', reviews)
    console.log('this.props=', this.props)

    return(
      <div>
        reviews:
          {reviews &&
            reviews.map(rev => {
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
