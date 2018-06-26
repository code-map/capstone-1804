import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

const styles = theme => ({
  formControl: {
    display: 'block',
    width: '100%',
    marginTop: 40
  },
  group: {
    display: 'inline'
  },
});

const BuilderSkills = ({classes, skill}) => {
  return (
    <FormControl component="fieldset" required className={classes.formControl}>
      <FormLabel component="legend">What skill level is your path?</FormLabel>
      <RadioGroup
        aria-label="skill"
        name="skill"
        className={classes.group}
        value={skill}
      >
        <FormControlLabel value="beginner" control={<Radio />} label="Beginner" />
        <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
        <FormControlLabel value="advanced" control={<Radio />} label="Advanced" />
      </RadioGroup>
    </FormControl>
  )
}

export default withStyles(styles)(BuilderSkills);
