import React, { Component } from 'react'
import PathProgress from './path-progress'

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
    borderStyle: 'solid'
  }
}

class SinglePath extends Component {
  constructor(){
    super()

    this.state = {
      selectedItems: []
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

  getCompletePercentage = () => {
    const steps = this.props.steps
    const total = this.props.steps.length
    let completed = 0

    steps.forEach(step => step.completed ? completed++ : '')
    return Math.round( (completed / total) * 100 )
  }

  render(){
    const { path } = this.props

    if(!path.modules) {
      return (<h3>Please select a path</h3>)
    }

    console.log('render', this.state)

    return (
      <div>
        <h3>{path.name}</h3>

        <PathProgress progress={this.getCompletePercentage()} />

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

                {this.state.selectedItems.indexOf(module.url) !== -1 ?
                  <ExpandLess
                    onClick={() => this.handleDropdownClick(module.url)}
                  /> :
                  <ExpandMore
                    onClick={() => this.handleCollapseClick(module.url)}
                  />
                }

              </ListItem>

              <Collapse
                in={this.state.selectedItems.indexOf(module.url) !== -1}
                timeout="auto" unmountOnExit>
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

export default SinglePath
