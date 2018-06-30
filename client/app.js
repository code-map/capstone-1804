import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MainNav} from './components'
import {Footer} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <MainNav />
      <Routes />
      <Footer />
    </div>
  )
}

export default App
