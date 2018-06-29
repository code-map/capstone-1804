import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import styled from "styled-components";


const StarBox = styled.div`
  z-Index: 2;
`

const Stars = (props) => {
  const {value} = props
  const emptyColor = value ? "#a5a5a5" : "#c8c8c8"
  const filledColor = "#e5aa3d"
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
