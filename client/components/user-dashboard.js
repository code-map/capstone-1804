import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavDashboard from './nav-dashboard'
import { UserPathDirectory, SinglePath } from './Path'
import { getSinglePathThunk, getSingleUserPathsThunk } from '../store'
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

  componentDidMount (){
    this.props.getSingleUserPaths(this.props.user.id)
  }

  handleSelect = (event) => {
    const pathId = event.target.value
    this.props.getSinglePath(pathId)
  }

  render () {
    const { allUserPaths } = this.props
    return (
      <div style={styles.container}>

        <h1 style={styles.header}>User dashboard</h1>

        <NavDashboard />

        <Grid container spacing={40}>
          <Grid item xs={3}>
          { allUserPaths &&
            <UserPathDirectory
              paths={allUserPaths}
              handleSelect={this.handleSelect}
            />
          }
          </Grid>

          <Grid item xs={8}>
            <SinglePath path={this.props.singlePath} />
          </Grid>

        </Grid>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    singlePath: state.pathReducer.singlePath,
    allUserPaths: state.pathReducer.allUserPaths
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSinglePath: (id) => {
      dispatch(getSinglePathThunk(id))
    },
    getSingleUserPaths: (userId) => {
      dispatch(getSingleUserPathsThunk(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
