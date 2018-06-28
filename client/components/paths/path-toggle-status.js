import React, {Component} from 'react'
import Switch from '@material-ui/core/Switch'

class PathToggleStatus extends Component {

  state = {
    status: true
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  render() {
    return (
      <div>
        <p>Toggle Path Public or Private</p>
        <Switch
          checked={this.state.status}
          onChange={this.handleChange('status')}
          value="status"
          color="primary"
        />
      </div>
    );
  }
}

export default PathToggleStatus
