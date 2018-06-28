import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'
import {ResourceCard} from '../resources'
import AddResource from './add-resource'
import PathToggleStatus from './path-toggle-status'

import { deleteSinglePathThunk, getStepCompletionSingleUserThunk, toggleStepCompletionThunk } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  deleteButton: {
    marginTop: 20,
    float: 'right'
  },
  chip: {
    fontWeight: 100,
    marginRight: 20
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
    if(this.props.path.steps.length > 1) {
      const pathName = this.props.path.details.properties.name
      const username = this.props.user
      this.props.getCompletedSteps(pathName, username)
    }
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

  toggleStatus = () => {

  }

  render(){
    const { path, user } = this.props
    return (
      <div>
        <h3>
          <Chip label={path.details.properties.status} style={styles.chip}/>
          {path.details.properties.name}
        </h3>
        <p>{path.details.properties.description}</p>

        { this.props.path.steps[0].step !== null &&
          <PathProgress progress={this.getCompletePercentage()} />
        }
        <div style={styles.container}>
          <List>
            { this.props.path.steps[0].step !== null &&
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
          { path.details.properties.owner === user &&
            <AddResource user={user} path={path} />
          }
          </List>
        </div>

        { path.details.properties.owner === user &&
          <div>
            <Button
              style={styles.deleteButton}
              onClick={this.handleDeletePath}
              variant="outlined"
              color="secondary"
            >
            Delete Path
            </Button>

            <PathToggleStatus
              toggleStatus={this.state.toggleStatus}
              style={styles.status} />

          </div>
        }

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
