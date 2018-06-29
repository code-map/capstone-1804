import React, { Component } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = {
  container: {
    padding: 20
  },
  buttonGroup: {
    marginTop: 20
  }
}

function getSteps() {
  return ['Select a learning path', 'Follow or create learning paths', 'Complete the resources in your path, comment, and rate!'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `If you already have learning paths available, you'll see them listed in your paths directory on the left. To add a path to the directory, you can either subscribe to an existing path, or, create your own by selecting "Add New Path" above.`;
    case 1:
      return 'You can follow learnings paths created by other users by searching or navigating through the category pages on the site. When you find a learning a path that interests you, click "Subscribe", or, create your own unique learning path by clicking "Add New Path" above and follow the prompts.';
    case 2:
      return `Your learnings paths are there for you to be more deliberate about your code learning goals. As you complete a resource in a learning path, be sure to check it off as complete. We'll keep track of your progress and give you updates on how you're doing.`;
    default:
      return 'Unknown step';
  }
}

class DashboardLanding extends Component {

  state = {
    activeStep: 0,
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
    })
  }

  render(){
    const steps = getSteps()
    const { activeStep } = this.state
    return (
      <div style={styles.container}>
        <Typography variant="title">Welcome to your code map dashboard</Typography>
        <br />
        <Typography variant="subheading">How to get started:</Typography>
        <br />
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div>
                    <div style={styles.buttonGroup}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0}>
            <Typography>Great job getting started! Good luck with your code learning goals!</Typography>
            <Button onClick={this.handleReset}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    )
  }
}

export default DashboardLanding
