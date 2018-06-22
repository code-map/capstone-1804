import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavDashboard from './nav-dashboard'
import { PathUserDirectory, PathSingle } from './Path'
import { getSinglePathThunk, getSingleUserPathsThunk, getPathStepsThunk } from '../store'
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
    this.props.getPathSteps(pathId)
  }

  render () {
    const { allUserPaths, pathSteps } = this.props
    const view = this.props.match.params.view

    return (
      <div style={styles.container}>

        <h1 style={styles.header}>User dashboard</h1>

        <NavDashboard view={view} />

        <Grid container spacing={40}>
          <Grid item xs={3}>

          { allUserPaths &&
            <PathUserDirectory
              paths={allUserPaths}
              handleSelect={this.handleSelect}
            />
          }
          </Grid>

          <Grid item xs={8}>
            { view === 'my-paths' &&
              <PathSingle
                steps={pathSteps}
                path={this.props.singlePath}
              />
            }

            { view === 'add-new-path' &&
              <p>Add new path view coming soon....</p>
            }

            { view === 'my-stats' &&
              <p>My stats view coming soon....</p>
            }
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
    allUserPaths: state.pathReducer.allUserPaths,
    pathSteps: state.pathReducer.pathSteps
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSinglePath: (id) => {
      dispatch(getSinglePathThunk(id))
    },
    getSingleUserPaths: (userId) => {
      dispatch(getSingleUserPathsThunk(userId))
    },
    getPathSteps: (pathId) => {
      dispatch(getPathStepsThunk(pathId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
