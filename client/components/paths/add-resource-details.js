import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addStepToPathThunk } from '../../store'

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Button from '@material-ui/core/Button'

const styles = {
  button: {
    marginTop: 30
  }
}

class AddResourceDetails extends Component {

  constructor(){
    super()
    this.state = {
      title: '',
      description: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { username, pathName, url } = this.props

    this.props.addStepToPath(username, pathName, url, {...this.state}, 'new')

    this.setState({
      title: '',
      description: ''
    })

    this.props.handleClose()
  }

  addResourceToPath = (username, pathName, url, body) => {
    this.props.addStepToPath(username, pathName, url, body, 'existing')
  }

  render(){
    const { username, pathName, resource, url } = this.props
    return (
      <div>
        { resource[0] === 'Not found' ? (
          <div>
            <p>We don't know this resource yet:</p>
            <p>{url}</p>
          <ValidatorForm
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            noValidate autoComplete="off"
          >
            <TextValidator
              id="step-title"
              label="What is the title of the resource?"
              name="title"
              value={this.state.title}
              placeholder="ie. Fullstack Academy Jumpstart Online"
              fullWidth
              margin="normal"
              required={true}
              validators={['required']}
              errorMessages={['A title is required']}
            />

            <TextValidator
              id="step-description"
              label="Add a short description for the resource"
              name="description"
              value={this.state.description}
              placeholder="ie. Jumpstart teaches the ABCs of programming in JavaScript"
              fullWidth
              margin="normal"
              required={true}
              validators={['required']}
              errorMessages={['A description is required']}
            />

            <Button
              style={styles.button}
              type="submit"
              size="large"
              variant="outlined">
              Add Resource To Your Path
            </Button>

          </ValidatorForm>
          </div>
          ) : (
            <div>
            <p>Resource exists! We'll add it right into your path.</p>
            {this.addResourceToPath(username, pathName, resource[0].url)}
            </div>
          )
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addStepToPath: (username, pathName, url, body, type) => {
      dispatch(addStepToPathThunk(username, pathName, url, body, type))
    }
  }
}

export default connect(null, mapDispatchToProps)(AddResourceDetails)
