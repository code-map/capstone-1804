import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavDashboard from './nav-dashboard'
import { getSingleUserPathsThunk } from '../store'
import { PathUserDirectory, PathSingle, PathBuilder } from './paths'
import Grid from '@material-ui/core/Grid'

// This is temporary until we have a user login solution
// integrated with Neo4j
const userName = 'shark-week365'

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
  constructor(){
    super()
    this.state = {
      selectedPath: []
    }
  }

  componentDidMount (){
    this.props.getSingleUserPaths(userName)
  }

  handleSelect = (name) => {
    const selectedPath = this.props.allUserPaths.find((path) => {
      return path[0].details.properties.name === name
    })

    this.setState({
      selectedPath: selectedPath[0]
    })
  }

  render () {
    const { allUserPaths } = this.props
    const view = this.props.match.params.view

    return (
      <div style={styles.container}>

        <h1 style={styles.header}>User dashboard</h1>

        <NavDashboard view={view} />

        <Grid container spacing={40}>
          <Grid item xs={3}>

          { allUserPaths &&
            <PathUserDirectory
              selected={this.state.selectedPath}
              paths={allUserPaths}
              handleSelect={this.handleSelect}
            />
          }
          </Grid>

          <Grid item xs={8}>
            { view === 'my-paths' &&
              <PathSingle
                path={this.state.selectedPath}
              />
            }

            { view === 'add-new-path' &&
              <PathBuilder user={userName} />
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
    allUserPaths: state.pathReducer.allUserPaths
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleUserPaths: (username) => {
      dispatch(getSingleUserPathsThunk(username))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
