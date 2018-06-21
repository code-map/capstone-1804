import React, { Component } from 'react'
import NavDashboard from './nav-dashboard'

const styles = {
  header: {
    textAlign: 'center',
    fontWeight: 100
  }
}

class UserDashboard extends Component {
  render () {
    return (
      <div>
        <h1 style={styles.header}>User dashboard</h1>
        <NavDashboard />
      </div>
    )
  }
}

export default UserDashboard
