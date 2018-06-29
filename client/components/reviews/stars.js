import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import styled from "styled-components";


const StarBox = styled.div`
  z-Index: 2;
`

const Stars = (props) => {
  const {value} = props
  return(
    <StarBox>
    <StarRatingComponent
          name="stars"
          editing={false}
          starCount={5}
          value={value}
        />
    </StarBox>
  )
}

export default Stars
