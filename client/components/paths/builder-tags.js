import React from 'react'

import TextField from '@material-ui/core/TextField'

const BuilderTags = ({tags}) => {
  return (
    <TextField
      id="path-tags"
      label="Give your path some tags"
      name="tags"
      value={tags}
      // InputLabelProps={{
      //   shrink: true,
      // }}
      placeholder="ie. data, d3, react"
      fullWidth
      margin="normal"
      required={true}
    />
  )
}

export default BuilderTags

