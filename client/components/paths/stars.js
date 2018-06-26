import React from 'react'
import StarRatingComponent from 'react-star-rating-component';

const Stars = (props) => {
  const {value} = props
  return(
    <StarRatingComponent
          name="stars"
          editing={false}
          starCount={5}
          value={value}
        />
  )
}

export default Stars
