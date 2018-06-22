import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Redirect } from 'react-router-dom'
import { searchPathsInCategory } from '../../store'

class CategorySearch extends React.Component {
  constructor(){
    super()
    this.state = {
      searchBox: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChange(event){
    this.setState({
      [event.target.className] : event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault()
    const categoryId = this.props.categoryId
    const searchVal = this.state.searchBox
    this.props.searchPathsInCategory(categoryId, searchVal)
    console.log('submitting query, this is: ', this)
    this.renderRedirect()
  }

  renderRedirect() {
    return(
      <Redirect to='/' />
    )
  }

  render() {
    return (
      <div>
        <form>
          <label> Search within category: </label>
          <input 
            type='text' 
            className='searchBox' 
            onChange={this.handleChange} 
            value={this.state.searchBox}
          />
          <button onClick={this.handleSubmit}> Search </button>
        </form>
      </div>
    )
  }
}

const mapState = (state) => {
  return({
    paths: state.pathReducer.popularPathsInCategory
  })
}

const mapDispatch = (dispatch) => {
  return({
    searchPathsInCategory : (categoryId, searchVal) => {
      return dispatch(searchPathsInCategory(categoryId, searchVal))
    }
  })
}

export default connect( mapState , mapDispatch )( CategorySearch )
