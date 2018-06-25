import React from 'react'
import TextField from '@material-ui/core/TextField'

const BuilderTitle = ({name}) => {
  return (
    <TextField
    id="path-title"
    label="What is the title of your path?"
    name="name"
    value={name}
    // InputLabelProps={{
    //   shrink: true,
    // }}
    placeholder="ie. Foundations of d3.js"
    fullWidth
    margin="normal"
    required={true}
  />
  )
}

export default BuilderTitle