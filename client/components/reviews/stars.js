import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import styled from "styled-components";


const StarBox = styled.div`
  z-Index: 2;
`

const Stars = (props) => {
  const {value} = props
  const emptyColor = value ? "#afafaf" : "#d6d6d6"
  const filledColor = "#f9ba45"
  return(
    <StarBox>
    <StarRatingComponent
          name="stars"
          editing={false}
          starCount={5}
          value={value}
          starColor={filledColor}
          emptyStarColor={emptyColor}
        />
    </StarBox>
  )
}

export default Stars
