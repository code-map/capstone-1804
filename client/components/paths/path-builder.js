import React, {Component} from 'react'

import BuilderTitle from './builder-title'
import BuilderDescription from './builder-description'
import BuilderCategory from './builder-category'
import BuilderTags from './builder-tags'
import BuilderSkills from './builder-skills'

import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#efefef',
    borderStyle: 'solid',
    padding: '40px',
    paddingTop: '20px'
  },
  button: {
    marginTop: 30
  }
})

class PathBuilder extends Component {

  constructor(){
    super()
    this.state = {
      title: '',
      description: '',
      category: '',
      tags: '',
      skill: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render(){
    const { classes } = this.props
    return (
      <div style={{maxWidth: 700}}>
        <h3>Add A New Path: {this.state.title}</h3>
          <form
            className={classes.container}
            onChange={this.handleChange}
            noValidate autoComplete="off"
          >

            <BuilderTitle title={this.state.title} />

            <BuilderDescription description={this.state.description} />

            <BuilderCategory category={this.state.category} />

            <BuilderTags tags={this.state.tags} />

            <BuilderSkills skill={this.state.skill} />

            <Button
              size="large"
              className={classes.button}
              variant="outlined">
              Start Adding Resources
            </Button>

          </form>
      </div>
    )
  }
}

export default withStyles(styles)(PathBuilder);
