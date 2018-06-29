import React from 'react'
import {connect} from 'react-redux'
import {ReviewCard} from '../reviews'
import {getAllReviewsOfResource} from '../../store'

const ResourceReviews = (props) => {
  const reviews = props.reviews[props.resourceName]
  return(
    <div>
      { reviews && <h3> Top Reviews: </h3> }
      {
        reviews &&
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
        add review functionality to be written
      </p>
    </div>
  )
}

export default (ResourceReviews)

