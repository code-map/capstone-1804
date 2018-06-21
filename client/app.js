import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {Navbar} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
