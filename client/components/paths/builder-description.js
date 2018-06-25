import React from 'react'
import TextField from '@material-ui/core/TextField'

const BuilderDescription = ({description}) => {
  return (
    <TextField
      multiline={true}
      id="path-description"
      label="Give your path a short description"
      name="description"
      value={description}
      // InputLabelProps={{
      //   shrink: true,
      // }}
      placeholder="ie. A learning path to get started using the d3.js data visualization library"
      fullWidth
      margin="normal"
      required={true}
    />
  )
}

export default BuilderDescription
