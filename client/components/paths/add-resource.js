import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getStepResourceThunk } from '../../store'
import AddResourceDetails from './add-resource-details'

import ListItem from '@material-ui/core/ListItem'
import {AddCircleOutline} from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = {
  icon: {
    marginRight: 20
  },
  text: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: '0.95em'
  }
}

class AddResource extends Component {
  constructor(){
    super()
    this.state = {
      open: false,
      url: ''
    }
  }

  handleResourceChange = event => {
    this.setState({
      url: event.target.value
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleResourceSubmit = () => {
    this.props.checkResource(this.state.url)
  }

  render() {
    const { user, path, resource} = this.props
    return (
      <div>

        <ListItem onClick={this.handleClickOpen}>
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

              <Button onClick={this.handleResourceSubmit} color="primary">
                Submit Resource
              </Button>
            </form>
            ) : (
              <AddResourceDetails
                handleClose={this.handleClose}
                username={user}
                pathName={path.details.properties.name}
                resource={resource}
                url={this.state.url}
              />
            )
          }

          </DialogContent>

        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resource: state.step.resource
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkResource: (url) => {
      dispatch(getStepResourceThunk(url))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddResource)
