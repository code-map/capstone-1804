import React, { Component } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

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
      checked: [0]
    }
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
    console.log(path)

    if(!path.modules) {
      return (<h3>Please select a path</h3>)
    }

    return (
      <div>
        <h3>{path.title}</h3>
        <div style={styles.container}>
          <List>
            { path.modules &&
              path.modules.map(module => (
              <ListItem
                key={module.id}
                role={undefined}
                dense
                button
                onClick={this.handleCompletedClick(module.id)}
              >
                <Checkbox
                  checked={this.state.checked.indexOf(module.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={module.title} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    )
  }
}

export default SinglePath
