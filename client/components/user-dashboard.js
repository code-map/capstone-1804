import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavDashboard from './nav-dashboard'
import { getSinglePathThunk, getSingleUserPathsThunk, getPathStepsThunk } from '../store'
import { PathUserDirectory, PathSingle } from './paths'
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
    // This is temporary until we have a user login solution
    // integrated with Neo4j
    const userName = 'shark-week365'
    this.props.getSingleUserPaths(userName)
  }

  handleSelect = (name) => {
    this.props.getSinglePath(name)
    this.props.getPathSteps(name)
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
    getSinglePath: (name) => {
      dispatch(getSinglePathThunk(name))
    },
    getSingleUserPaths: (userId) => {
      dispatch(getSingleUserPathsThunk(userId))
    },
    getPathSteps: (name) => {
      dispatch(getPathStepsThunk(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
