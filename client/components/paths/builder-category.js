import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

const styles = theme => ({
  formControl: {
    marginTop: 10,
    marginBottom: 10,
    width: 250
  }
})

const BuilderCategory = ({classes, category}) => {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="age-native-simple">Select a Language Category</InputLabel>
      <Select
        native
        value={category}
        inputProps={{
          name: 'language',
          id: 'path-lang',
        }}
        required={true}
      >
        <option value="" />
        <option value="Javascript">Javascript</option>
        <option value="PHP">PHP</option>
        <option value="HTML">HTML</option>
        <option value="Other">Other</option>
      </Select>
    </FormControl>
  )
}

export default withStyles(styles)(BuilderCategory);

