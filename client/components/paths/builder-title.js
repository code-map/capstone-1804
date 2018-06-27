import React, {Component} from 'react'
import TextField from '@material-ui/core/TextField'
class BuilderTitle extends Component {

  handleChange = () => {
    // Throttle search
  }

  render(){
    const { name } = this.props
    return (
      <TextField
        onChange={this.handleChange}
        id="path-title"
        label="What is the title of your path?"
        name="name"
        value={name}
        placeholder="ie. Foundations of d3.js"
        fullWidth
        margin="normal"
        required={true}
        error={true}
      />
    )
  }
}

export default BuilderTitle
