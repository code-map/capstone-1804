import React, { Component } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
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
      checked: [0],
      open: false,
      selectedItems: []
    }
  }

  handleDropdownClick = () => {
    this.setState({ open: !this.state.open })
  }

  handleCompletedClick = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({
      checked: newChecked
    })
  }

  render(){
    const { path } = this.props
    console.log(this.state.open)

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
              <div key={module.id}>
              <ListItem
                key={module.id}
                role={undefined}
                dense
                button
              >
                <Checkbox
                  onChange={this.handleCompletedClick(module.id)}
                  checked={this.state.checked.indexOf(module.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <img src="https://i.imgur.com/4nEBtUT.png" width={75} />
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

export default SinglePath
