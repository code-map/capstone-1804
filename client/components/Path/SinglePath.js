import React, { Component } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
    maxWidth: '600px'
  }
}

class SinglePath extends Component {
  constructor(){
    super()

    this.state = {
      open: false
    }
  }

  handleDropdownClick = () => {
    this.setState({ open: !this.state.open })
  }

  handleCompletedClick = value => () => {
    console.log('toggle completed click!', value)
    // To complete when DB is operational
  }

  checkForComplete = (url) => {
    const pathSteps = this.props.steps
    let found = false
    for(var i = 0; i < pathSteps.length; i++) {
      if (pathSteps[i].url === url && pathSteps[i].completed) {
        found = true
        break
      }
    }
    return found
  }

  render(){
    const { path } = this.props

    if(!path.modules) {
      return (<h3>Please select a path</h3>)
    }

    return (
      <div>
        <h3>{path.name}</h3>
        <div style={styles.container}>
          <List>
            { path.modules &&
              path.modules.map(module => (
              <div key={module.url}>
              <ListItem
                key={module.url}
                role={undefined}
                dense
                button
                disableRipple
              >
                <Checkbox
                  onChange={this.handleCompletedClick(module.url)}
                  checked={this.checkForComplete(module.url)}
                  disableRipple
                />

                <img src={module.imageUrl} width={75} />

                <ListItemText primary={module.name} />

                {this.state.open ?
                  <ExpandLess onClick={this.handleDropdownClick} /> :
                  <ExpandMore onClick={this.handleDropdownClick} />
                }

              </ListItem>

              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button>
                    <p>In the dropdown!</p>
                  </ListItem>
                </List>
              </Collapse>

              </div>
            ))}
          </List>
        </div>
      </div>
    )
  }
}

export default (SinglePath)
