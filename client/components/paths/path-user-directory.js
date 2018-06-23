import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

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

const PathUserDirectory = ({paths, handleSelect}) => {
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>My Paths Directory</h4>
      <List>
        { paths.map((path) => {
          const name = path[0].path.properties.name
            return (
              <ListItem
                key={name}
                onClick={() => handleSelect(name)}
              >
                {name}
              </ListItem>
            )
          })
        }
      </List>
    </div>
  )
}

export default PathUserDirectory
