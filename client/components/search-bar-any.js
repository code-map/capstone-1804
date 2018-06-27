import { createFuzzyMatchThunk, createMatchAllInCategoryThunk } from '../store'
import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'


class SearchAny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
  }

  handleChange = async (event) => {
      await this.setState({
        input: event.target.value
      })
      //if you have your routes set up correctly, this clause should make it so
      //that you don't have to pass in any additional props
        if(this.props.match.params){
          this.props.fuzzyMatchByCategory(this.state.input, this.props.category)
        }else{
          this.props.fuzzyMatch(this.state.input)
        }
    }


  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      return this.props.matches
    }
  }

  mapOptions = () => {
    const matches = this.props.matches
    if(matches.length && this.state.input !== ''){
      return(<div style={{zIndex:0}}>
        {
          matches.map((match) => {
            const {name} = match
            return <p key={name}>{name}</p>
          })
        }
        </div>

      )
    }
  }

  render () {
    return (
      <div>
      <TextField
        id="search"
        onChange={this.handleChange}
        onKeyPress={(e) => {
          if(e.key === 'Enter')
          this.handleKeyPress(e)
        }}
        value={this.state.input}
        label={`Refine your search`}
        type="search"
        margin="normal"
      />
      <div>
        {
          this.mapOptions()
        }
      </div>
      </div>
    )

  }

}

const mapState = (state) => {
    return {
      matches: state.searchMatches
    }
}

const mapDispatch = (dispatch) => {
  return {
    fuzzyMatchByCategory : (string, category)=> {
      dispatch(createMatchAllInCategoryThunk(string, category))
    },
    fuzzyMatch : (string) => {
      dispatch(createFuzzyMatchThunk(string))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(SearchAny))

