import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const styles = {
  container: {
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid'
  },
  header: {
    textAlign: 'center'
  }
}

const UserPathDirectory = ({paths, handleSelect}) => {
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>My Paths Directory</h4>
      <List>
        {
          paths.map((path) => {
            return (
              <ListItem
                key={path.id}
                value={path.id}
                onClick={(event) => handleSelect(event)}
              >
                {path.title}
              </ListItem>
            )
          })
        }
      </List>
    </div>
  )
}

export default UserPathDirectory
