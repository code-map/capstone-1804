import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavDashboard from './nav-dashboard'
import { getSingleUserPathsThunk, getSinglePathByUidThunk } from '../store'
import { PathUserDirectory, PathSingle, PathBuilder } from './paths'
import Grid from '@material-ui/core/Grid'
import history from '../history'

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
    const username = this.props.user.name
    this.props.getSingleUserPaths(username)
  }

  handleSelect = (uid) => {
    const selectedPath = this.props.allUserPaths.find((path) => {
      return path[0].details.properties.uid === uid
    })

    this.setState({
      selectedPath: selectedPath[0]
    })

    this.props.getSinglePathByUid(uid)
    history.push('/user/dashboard/my-paths')
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.path !== this.props.path){
      const pathUid = nextProps.path[0].details.properties.uid
      const username = this.props.user

      this.props.getSinglePathByUid(pathUid)
      this.props.getCompletedSteps(pathUid, username)
    }
  }

  render () {
    const { allUserPaths, singlePath, user } = this.props
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
              selected={this.state.selectedPath}
            />
          }
          </Grid>

          <Grid item xs={8}>
            { view === 'my-paths' && singlePath[0] &&
              <PathSingle
                user={user.name}
                path={singlePath[0]}
              />
            }

            { view === 'my-paths' && !singlePath[0] &&
              <p>Select a path</p>
            }

            { view === 'add-new-path' &&
              <PathBuilder
                user={user.name}
              />
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
    allUserPaths: state.pathReducer.allUserPaths,
    singlePath: state.pathReducer.singlePath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleUserPaths: (username) => {
      dispatch(getSingleUserPathsThunk(username))
    },
    getSinglePathByUid: (uid) => {
      dispatch(getSinglePathByUidThunk(uid))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard)
