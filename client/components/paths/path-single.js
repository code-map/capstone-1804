import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'
import {ResourceCard} from '../resources'

import { deleteSinglePathThunk, getStepCompletionSingleUserThunk, toggleStepCompletionThunk } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  }
}

class SinglePath extends Component {
  constructor(){
    super()

    this.state = {
      selectedItems: []
    }
  }

  componentDidMount = () => {
    const pathName = this.props.path.details.properties.name
    const username = this.props.user
    this.props.getCompletedSteps(pathName, username)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.path !== this.props.path){
      const pathName = nextProps.path.details.properties.name
      const username = this.props.user
      this.props.getCompletedSteps(pathName, username)
    }
  }

  handleDropdownClick = (step) => {
    this.setState((prevState) => {
      return {
        selectedItems: prevState.selectedItems.filter((el) => el !== step)
      }
    })
  }

  handleCollapseClick = (step) => {
    this.setState((prevState) => {
      return {
        selectedItems: prevState.selectedItems.concat([step])
      }
    })
  }

  handleCompletedClick = stepUrl => async () => {
    const pathName = this.props.path.details.properties.name
    const username = this.props.user
    const bool = await this.checkForComplete(stepUrl)

    this.props.toggleStepCompletion(pathName, username, stepUrl, bool)
  }

  handleDeletePath = (event) => {
    event.preventDefault()
    const pathName = this.props.path.details.properties.name
    if (window.confirm(`Are you sure you want to delete ${pathName}?`)){
      this.props.deleteSinglePath(pathName)
    }
  }

  checkForComplete = (url) => {
    const completedSteps = this.props.completedSteps
    let found = false

    for(let i = 0; i < completedSteps.length; i++) {
      const stepUrl = completedSteps[i].stepUrl
      if(stepUrl === url && completedSteps[i].completed) {
        found = true
        break
      }
    }
    return found
  }

  getCompletePercentage = () => {
    const steps = this.props.completedSteps
    const total = this.props.completedSteps.length
    let completed = 0

    steps.forEach(step => step.completed ? completed++ : '')
    return Math.round( (completed / total) * 100 )
  }

  render(){
    const path = this.props.path

    return (
      <div>
        <h3>{path.details.properties.name}</h3>
        <PathProgress progress={this.getCompletePercentage()} />
        <div style={styles.container}>
          <List>
            { path.steps.length > 1 &&
              path.steps.map(step => {
                const stepUrl = step.resource.properties.url
                return (
                  <ResourceCard 
                    key={step.resource.identity.low} 
                    resourceProperties={step.resource.properties} 
                    handleCompletedClick={() => this.handleCompletedClick(stepUrl)}
                    checkForComplete={() => this.checkForComplete(stepUrl)}
                  />
                )
              }
             )}
          </List>
        </div>

          <Button
            onClick={this.handleDeletePath}
            variant="outlined"
            color="secondary"
          >
            Delete Path
          </Button>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    completedSteps: state.step.completedSteps
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSinglePath: (name) => {
      dispatch(deleteSinglePathThunk(name))
    },
    getCompletedSteps: (pathName, username) => {
      dispatch(getStepCompletionSingleUserThunk(pathName, username))
    },
    toggleStepCompletion: (pathName, username, stepUrl, bool) => {
      dispatch(toggleStepCompletionThunk(pathName, username, stepUrl, bool))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePath)
