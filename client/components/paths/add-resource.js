import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getStepResourceThunk, getSinglePathByUidThunk, removeResourceFromStore, getRecommendationsThunk, addSuggestionThunk } from '../../store'
import AddResourceDetails from './add-resource-details'
import StarRatingComponent from 'react-star-rating-component';

import ListItem from '@material-ui/core/ListItem'
import {AddCircleOutline} from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import styled from "styled-components"

const SuggestCenter = styled.div`


`


const styles = {
  icon: {
    marginRight: 20
  },
  text: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: '0.95em'
  },
  header: {
    paddingBottom: 0
  },
  suggestCenter: {
    display: 'flex',
    width: '400px',
    alignItems: 'baseline',
    justifyContent: 'space-around'
  }
}

class AddResource extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      openSuggestions: false,
      url: '',
      errorMessage: ''
    }
  }

  componentDidMount = async () => {
    const { steps } = this.props
    const pathUid = this.props.path[0].details.properties.uid
    const resourceUids = steps.map(step => {
      return step.resource.properties.uid
    })
    const lastStep = resourceUids[resourceUids.length-1]
    await this.props.getNextStepSuggestion(lastStep, pathUid)
  }

  handleResourceChange = event => {
    this.setState({
      url: event.target.value
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleSuggestionOpen = () => {
    this.setState({ openSuggestions: true })
  }

  handleSuggestionClose = () => {
    this.setState({ openSuggestions: false })
  }

  handleClose = () => {
    this.setState({
      open: false,
      url: '',
      errorMessage: ''
    })

    const uid = this.props.path[0].details.properties.uid
    this.props.getSinglePath(uid)

    this.props.removeResourceFromStore()
  }

  handleResourceSubmit = async () => {

  if (!this.state.url.startsWith('http')) {
    await this.setState((previousState) => {
      let newUrl = 'http://' + previousState.url
      return { ...previousState, url: newUrl };
  });
  }

    const duplicateCheck = this.props.path[0].steps.find((step) => {
      if(step.resource !== null){
        return step.resource.properties.url === this.state.url
      }
    })

    if(!duplicateCheck){
      this.props.checkResource(this.state.url)
    } else {
      this.setState({
        errorMessage: 'That resource is already added to your path.'
      })
    }
  }

  getSuggestions = () => {
    const currentResources = this.props.steps.map(step => {
      return step.resource.properties.uid
    })
    const suggestions = this.props.suggestions.map(suggestion => {
      if(!currentResources.includes(suggestion.uid)){
        return suggestion
      }else{
        return null
      }
    })
    const recs = suggestions.filter(sug => sug)
    const weighted = recs.map(rec => {
      const weight = rec.averageRating * Math.log(rec.numReviews)/Math.log(15)
      return {...rec, weighted: weight}
    })
    const recsSortedByWeight = weighted.sort((a, b) => {
      return a.weight - b.weight;
    })
    return recsSortedByWeight
  }

  handleAddSuggestionClick = (event, resource) => {
    const pathUid = this.props.path[0].details.properties.uid
    const stepUrl = resource.resource.url
    this.props.addSuggestion(pathUid, this.props.user, stepUrl)
    this.handleSuggestionClose()
    //this.getSinglePath(pathUid)
  }


  render() {
    const { user, path, resource, steps} = this.props
    const suggestion = this.getSuggestions()


    return (
      <div>

        <ListItem button={true} onClick={this.handleClickOpen}>
          <AddCircleOutline style={styles.icon}/>
          <p style={styles.text}>Add a new resource to this path</p>
        </ListItem>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Add New Resource</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Paste a resource link below. If it's already in our catalog, we'll  automatically add it to your path. If it's new to us (great find!), you'll have a chance to edit the description before adding.
            </DialogContentText>

            { this.state.errorMessage &&
              <p>{this.state.errorMessage}</p>
            }

          { this.props.resource.length < 1 ? (
            <form onSubmit={this.handleResourceSubmit} onChange={this.handleResourceChange}>
              <TextField
                autoFocus
                margin="dense"
                id="resource-link"
                label="Resource link"
                type="text"
                value={this.state.url}
                placeholder="eg. http://medium.com/the-greatest-js-tut-ever"
                fullWidth
              />

              { !this.state.errorMessage &&
                <Button onClick={this.handleResourceSubmit} color="primary">
                  Submit Resource
                </Button>
              }

            </form>
            ) : (
              <AddResourceDetails
                handleClose={this.handleClose}
                username={user}
                pathUid={path[0].details.properties.uid}
                resource={resource}
                url={this.state.url}
              />
            )
          }

          </DialogContent>

        </Dialog >

        <ListItem button={true} onClick={this.handleSuggestionOpen}>
          <AddCircleOutline style={styles.icon}/>
          <p style={styles.text}>get a suggestion</p>
        </ListItem>

        <Dialog
          open={this.state.openSuggestions}
          onClose={this.handleSuggestionClose}
        >
          <DialogTitle style={styles.header}>Suggested Next Step</DialogTitle>
         {
          suggestion.length && <DialogContent>
            {
              <div>
              <p>based on your current path we think you might enjoy:</p>
              <div style={styles.suggestCenter}>
                  <h4>{`${suggestion[0].resource.name} `}</h4>
                  <StarRatingComponent
                      name="stars"
                      editing={false}
                      starCount={5}
                      value={suggestion[0].averageRating}
                    />
              </div>
              <div style={styles.suggestCenter}>
                    <Button onClick={(e)=> this.handleAddSuggestionClick(e, suggestion[0])} color="primary">
                      Add Resource
                    </Button>
                    <Button onClick={this.handleSuggestionClose} color="primary">
                      No Thanks
                    </Button>
                </div>
                </div>
            }
          </DialogContent>
         }

        </Dialog>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resource: state.step.resource,
    suggestions: state.resource.suggestions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkResource: (url) => {
      dispatch(getStepResourceThunk(url))
    },
    getSinglePath: (uid) => {
      dispatch(getSinglePathByUidThunk(uid))
    },
    removeResourceFromStore: () => {
      dispatch(removeResourceFromStore())
    },
    getNextStepSuggestion: (resourceUid, pathUid) => {
      dispatch(getRecommendationsThunk(resourceUid, pathUid))
    },
    addSuggestion: (pathUid, username, stepUrl) => {
      dispatch(addSuggestionThunk(pathUid, username, stepUrl))

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddResource)
