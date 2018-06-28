import React from 'react'
import SingleModule from './path-single-module'

const SinglePathUnauth extends React.Component() {
  constructor(){
    super()
  }

  render(){
    return(
      path.steps.length > 1 &&
      path.steps.map(step => {
        <SingleModule />

      })
  }
}

export default SinglePathUnauth
