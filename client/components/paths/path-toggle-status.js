import React, {Component} from 'react'
import Switch from '@material-ui/core/Switch'

class PathToggleStatus extends Component {
  // state = {
  //   status: this.props.Status === 'public'
  // }

  // handleChange = name => event => {
  //   this.props.togglePublic(this.props.uid, (this.props.Status==='public'))
  //   this.setState({ [name]: event.target.checked });
  // }

  // handleChange = () => {
  //   this.props.toggle(this.props.uid, this.props.Status === 'draft' ? 'public' : 'draft')
  //   // this.setState({[name]: event.target.checked})
  // }

  render() {
    return (
      <div>
        {console.log('props status', this.props)}
        <p>Toggle Path Public or Private</p>
        <Switch
          checked={this.props.Status === 'public'}
          onChange={this.handleChange}
          value="status"
          color="primary"
        />
      </div>
    )
  }
}

export default PathToggleStatus
