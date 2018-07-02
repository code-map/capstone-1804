import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'
import {ResourceCard} from '../resources'
import AddResource from './add-resource'
import PathToggleStatus from './path-toggle-status'
import history from '../../history'
import { withRouter } from 'react-router-dom'

import { deleteSinglePathThunk, getStepCompletionSingleUserThunk, toggleStepCompletionThunk, togglePublicThunk, unfollowPathThunk } from '../../store'

import List from '@material-ui/core/List'
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
      selectedItems: [],
      cleared: false
    }
  }

  componentDidMount = () => {
    const path = this.props.path[0]
    if(path.steps.length > 1) {
      const pathUid = path.details.properties.uid
      const username = this.props.user
      this.props.getCompletedSteps(pathUid, username)
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.path[0] !== this.props.path[0]){
      const pathUid = nextProps.path[0].details.properties.uid
      const username = this.props.user

      this.props.getCompletedSteps(pathUid, username)
    }
  }

  handleCompletedClick = stepUrl => async () => {
    const pathUid = this.props.path[0].details.properties.uid
    const username = this.props.user
    const bool = await this.checkForComplete(stepUrl)

    this.props.toggleStepCompletion(pathUid, username, stepUrl, bool)
  }

  handleDeletePath = (event) => {
    event.preventDefault()
    const pathName = this.props.path[0].details.properties.name
    const uid = this.props.path[0].details.properties.uid
    const subscribers = Number(this.props.path[0].subscribers.low - 1)
    const username = this.props.user

    if (window.confirm(`Are you sure you want to delete ${pathName}?  ${subscribers} other users subscribed to this path will no longer be able to access it.`)){
      this.props.deleteSinglePath(uid, username)
      history.push('/user/dashboard/add-new-path')
    }
  }

  handleUnfollowPath = (event) => {
    event.preventDefault()
    const { slug, uid } = this.props.path[0].details.properties
    const username = this.props.user
    this.props.unfollowPath(uid, username, slug)
    history.push('/user/dashboard/add-new-path')

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

    if(steps.length === 0) {
      return 0
    } else {
      steps.forEach(step => step.completed ? completed++ : '')
      return Math.round( (completed / total) * 100 )
    }
  }

  render(){
    const { user, path } = this.props
    const pathDetails = path[0].details.properties
    const status = pathDetails.status
    const pathSteps = path[0].steps
    const isOwner = pathDetails.owner === user
    return (
      <div>
        <h2>
          { pathDetails.status === 'draft' &&
            <Chip label='Private Path' style={styles.chip}/>
          }
          {pathDetails.name}
        </h2>
        <p>{pathDetails.description}</p>

        { pathSteps[0].step !== null &&
          <PathProgress progress={this.getCompletePercentage()} />
        }
        <div style={styles.container}>
          <List>
            { pathSteps[0].step !== null &&
              pathSteps.map(step => {
                const stepUrl = step.resource.properties.url
                return (
                  <ResourceCard
                    key={step.resource.identity.low}
                    isLoggedIn={!!user}
                    userUid={user.uid}
                    resourceProperties={step.resource.properties}
                    handleCompletedClick={() => this.handleCompletedClick(stepUrl)}
                    checkForComplete={() => this.checkForComplete(stepUrl)}
                  />
                )
            } ) }

          { path[0].details.properties.owner === user &&
            <AddResource user={user} path={path} />
          }
          </List>
        </div>

        { path[0].details.properties.owner === user &&
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
              uid={path[0].details.properties.uid}
              Status={status}
              style={styles.status}
              toggle={this.props.togglePublic}
              username={this.props.user}
              />

          </div>
        }

        { !isOwner &&
          <div>
            <Button
              style={styles.deleteButton}
              onClick={this.handleUnfollowPath}
              variant="outlined"
              color="secondary"
            >
            Unfollow Path
            </Button>
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
    deleteSinglePath: (uid, username) => {
      dispatch(deleteSinglePathThunk(uid, username))
    },
    getCompletedSteps: (pathUid, username) => {
      dispatch(getStepCompletionSingleUserThunk(pathUid, username))
    },
    toggleStepCompletion: (pathUid, username, stepUrl, bool) => {
      dispatch(toggleStepCompletionThunk(pathUid, username, stepUrl, bool))
    },
    togglePublic: (uid, status, username) => {
      dispatch(togglePublicThunk(uid, status, username))
    },
    unfollowPath: (uid, user, slug) => {
      dispatch(unfollowPathThunk(uid, user, slug))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SinglePath))
