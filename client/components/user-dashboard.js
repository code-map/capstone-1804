import React, { Component } from 'react'
import NavDashboard from './nav-dashboard'
import { UserPathDirectory } from './Path'
import Grid from '@material-ui/core/Grid'

const styles = {
  header: {
    textAlign: 'center',
    fontWeight: 100
  },
  container: {
    padding: 20
  }
}

class UserDashboard extends Component {
  render () {
    return (
      <div style={styles.container}>

        <h1 style={styles.header}>User dashboard</h1>

        <NavDashboard />

        <Grid container spacing={16}>

          <Grid item xs={4}>
            <UserPathDirectory />
          </Grid>

          <Grid item xs={8}>
            <p>Placeholder for path display</p>
          </Grid>

        </Grid>

      </div>
    )
  }
}

export default UserDashboard
