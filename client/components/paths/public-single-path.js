import React, { Component } from 'react'
import { connect } from 'react-redux'
import PathProgress from './path-progress'

import { getSinglePathThunk } from '../../store'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  }
}

class PublicSinglePath extends Component {
  constructor(){
    super()

    this.state = {
      selectedItems: []
    }
  }

  componentDidMount = () => {
    const {pathName} = this.props.match.params
    getPath('test')
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




  render(){
    const path = this.props.path

    return (
      <div>
        <h3>{path.details.properties.name}</h3>
        <div style={styles.container}>
          <List>
            { path.steps.length > 1 &&
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

const mapStateToProps = (state) => {
  return {
    completedSteps: state.pathReducer.singlePath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPath: (name) => {
      dispatch(getSinglePathThunk(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicSinglePath)
