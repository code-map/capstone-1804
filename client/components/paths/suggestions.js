import React, { Component } from 'react'
import { connect } from 'react-redux'
import { makeSuggestionsThunk, clearSuggestions, addStepToPathThunk } from '../../store'
import { withRouter } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component';
import ListItem from '@material-ui/core/ListItem'
import {AddCircleOutline} from '@material-ui/icons'


const styles = {
  suggestCenter: {
    display: 'flex',
    width: '400px',
    alignItems: 'baseline',
    justifyContent: 'space-around'
  },
  suggest: {
    marginTop: 0,
    marginBottom: 0
  },
  suggestBorder: {
    marginLeft: 20
  },
  noSuggestions: {
    paddingLeft: 30,
    marginTop: 0
  },
  icon: {
    marginRight: 20
  },
  text: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: '0.95em'
  }
}

class Suggestions extends Component {
   constructor(props){
     super(props)
   }

  async componentWillMount () {
    const steps = this.props.path[0].steps
    const resourceuid = steps[steps.length-1].resource.properties.uid
    const pathuid = this.props.path[0].details.properties.uid
    await this.props.getSuggestion(pathuid, resourceuid)
  }

  addSuggestionToPath = (url) => {
    const path = this.props.path[0].details.properties
    const username = path.owner
    const pathUid = path.uid
    this.props.addSuggestion(username, pathUid, url, {}, 'existing')
  }

  render(){
    const { path, suggestions } = this.props
    console.log('PATH', path)
    const resources = path[0].steps.map(element => {
        return element.resource.properties
      })
    const resourceUids = resources.map(res => res.uid)
    const filteredSuggestions = this.props.suggestions.map((suggestion) => {
          if(!resourceUids.includes(suggestion.uid)){
            return suggestion
          }
    }).filter(sug => sug !== undefined)

    if(filteredSuggestions.length > 0){
      return(
        <div style={styles.suggestBorder}>
          <p style={styles.suggest}>based on your current path we think you might enjoy:</p>
            <a href={filteredSuggestions[0].url} >
              <div style={styles.suggestCenter} >
                  <h4>{`${filteredSuggestions[0].name} `}</h4>
                  <StarRatingComponent
                      name="stars"
                      editing={false}
                      starCount={5}
                      value={suggestions[0].stars}/>
              </div>
            </a>
            {/* <ListItem button={true} onClick={() => this.addSuggestionToPath(filteredSuggestions[0].url)}>
              <AddCircleOutline style={styles.icon}/>
            <p style={styles.text}>Add suggestion to path</p>
            </ListItem> */}
        </div>
        )
      }else{
        return(
          <p style={styles.noSuggestions}>no suggestions at this time...</p>
        )}
  }
}

const mapStateToProps = (state) => {
  return {
    suggestions: state.resource.suggestions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSuggestion: (pathuid, resourceuid) => {
      dispatch(makeSuggestionsThunk(pathuid, resourceuid))
    },
    addSuggestion: (username, pathUid, url, body, type) => {
      dispatch(addStepToPathThunk(username, pathUid, url, body, type))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Suggestions))
