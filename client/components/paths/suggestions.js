import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getStepResourceThunk, getSinglePathByUidThunk, removeResourceFromStore, makeSuggestionsThunk, clear_suggestions } from '../../store'
import AddResourceDetails from './add-resource-details'
import { withRouter } from 'react-router-dom'

import ListItem from '@material-ui/core/ListItem'
import {AddCircleOutline} from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import StarRatingComponent from 'react-star-rating-component';


const styles = {
  icon: {
    marginRight: 20
  },
  text: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: '0.95em'
  },
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
    clear: () => {
      dispatch(clear_suggestions())
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddResource))
