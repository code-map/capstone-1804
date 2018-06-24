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
    const steps = this.props.path.steps
    let found = false
    for(let i = 0; i < steps.length; i++) {
      const stepUrl = steps[i].resource.properties.url
      if(stepUrl === url && steps[i].step.properties.completed) {
        found = true
        break
      }
    }
    return found
  }

  getCompletePercentage = () => {

    // To be completed when db data is available

    // const steps = this.props.steps
    // const total = this.props.steps.length
    // let completed = 0

    // steps.forEach(step => step.completed ? completed++ : '')
    // return Math.round( (completed / total) * 100 )

    return 50
  }

  render(){
    const { path } = this.props

    if(!path.details) {
      return (<h3>Please select a path</h3>)
    }

    return (
      <div>
        <h3>{path.details.properties.name}</h3>

        <PathProgress progress={this.getCompletePercentage()} />

        <div style={styles.container}>
          <List>
            { path.steps &&
              path.steps.map(step => {
                const stepUrl = step.resource.properties.url
                return (
                <div key={stepUrl}>
                  <ListItem
                    key={stepUrl}
                    role={undefined}
                    dense
                    button
                    disableRipple
                  >
                    <Checkbox
                      onChange={this.handleCompletedClick(stepUrl)}
                      checked={this.checkForComplete(stepUrl)}
                      disableRipple
                    />

                    {
                      step.resource.properties.imageUrl ? (
                        <img src={step.resource.properties.imageUrl} width={75} />
                      ) : (
                        <img src="../../default.png" width={75} />
                      )
                    }

                    <ListItemText primary={step.resource.properties.name} />

                    {this.state.selectedItems.indexOf(stepUrl) !== -1 ?
                      <ExpandLess
                        onClick={() => this.handleDropdownClick(stepUrl)}
                      /> :
                      <ExpandMore
                        onClick={() => this.handleCollapseClick(stepUrl)}
                      />
                    }

                  </ListItem>

                  <Collapse
                    in={this.state.selectedItems.indexOf(stepUrl) !== -1}
                    timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem button>
                        <p>In the dropdown for "{step.resource.properties.name}"</p>
                      </ListItem>
                    </List>
                  </Collapse>

                  </div>
                )
            } ) }
          </List>
        </div>
      </div>
    )
  }
}

export default SinglePath
