import React from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

class NavDashboard extends React.Component {

  constructor(){
    super()
    this.state = {
      value: 'my-paths'
    }
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    return (
      <Grid container spacing={24} direction="column" align="center">
        <Grid item xs={6}>
          <Paper>
            <Tabs
              value={this.state.value}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChange}
            >
              <Tab label="My Paths" value="my-paths" />
              <Tab label="Add New Path" value="add-new-path" />
              <Tab label="My Stats" value="my-stats" />
            </Tabs>
          </Paper>
        </Grid>
      </Grid>
    )
  }

}

export default NavDashboard
