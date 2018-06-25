import React from 'react'

import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'

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

const PathUserDirectory = ({paths, handleSelect, selected}) => {
  let active = false
  return (
    <div style={styles.container}>
      <h4 style={styles.header}>My Paths Directory</h4>
      <MenuList>
        { paths.map((path) => {
          const name = path[0].details.properties.name
          if (selected.details){
            active = selected.details.properties.name === name
          }
            return (
              <MenuItem
                key={name}
                onClick={() => handleSelect(name)}
                selected={active}
              >
                {name}
              </MenuItem>
            )
          })
        }
      </MenuList>
    </div>
  )
}

export default PathUserDirectory
