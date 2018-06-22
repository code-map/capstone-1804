import React from 'react'

const PathCard = (props) => {
  return(
    <div>
      <h3>
        {props.name}
      </h3>
      <h3>
        {props.author}
      </h3>
      <h3>
        {props.rating}
      </h3>
    </div>
  )
}

export default PathCard

