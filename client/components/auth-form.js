import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth, newUserThunk} from '../store'
import history from '../history'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

/**
 * COMPONENT
 */

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
    marginTop: 10
  }
})

const AuthForm = props => {
  const {name, displayName, handleSubmit, error, handleNewuser, classes} = props

  return (
    <div>
      <form
        onSubmit={displayName === 'Sign Up' ? handleNewuser : handleSubmit}
        name={name}
        className={classes.container}
      >
        <TextField
          id="username"
          name="username"
          label="Username"
          required={true}
        />
        {displayName === 'Sign Up' && (
          <div>
            <TextField id="email" name="email" label="Email" required={true} />
          </div>
        )}
        <TextField
          id="password"
          name="password"
          label="Password"
          required={true}
        />
        <div>
          <Button
            type="submit"
            size="large"
            className={classes.button}
            variant="outlined"
          >
            {displayName}
          </Button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
      <a href="/auth/google">{displayName} with Google (COMING SOON!)</a>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const name = evt.target.username.value
      const password = evt.target.password.value
      dispatch(auth(name, password, formName))
    },
    handleNewuser(evt) {
      evt.preventDefault()
      const name = evt.target.username.value
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(newUserThunk(name, email, password))
      history.push('/home')
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(
  withStyles(styles)(AuthForm)
)
export const Signup = connect(mapSignup, mapDispatch)(
  withStyles(styles)(AuthForm)
)
/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
