import React, { Component } from 'react'
import StarRatingComponent from 'react-star-rating-component'

import { Dialog, DialogTitle } from '@material-ui/core'

class ResourceRating extends Component {
  constructor() {
    super()

    this.state = {
      rating: 3
    }
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue})
  }

  render(){
    const { rating } = this.state
    return (
      <div>
        <h2>Rating from state: {rating}</h2>
        <StarRatingComponent
          name="resource-rating"
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />
      </div>
    )
  }
}

export default ResourceRating
