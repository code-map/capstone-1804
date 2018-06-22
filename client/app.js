import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MainNav} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <MainNav />
      <Routes />
    </div>
  )
}

export default App
