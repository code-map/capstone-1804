import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import  Grid from '@material-ui/core/Grid'
import { getAllPathsInCategory } from '../../store'
import { PathCardSmall } from '../paths'

const CategoryAllPaths = (props) => {
    console.log('props in all path', props)
    const {paths} = props
    return(
        <Grid container spacing={40}>
          {paths.map((path) =>
            <Grid item xs={6} key={path.name}>
              <PathCardSmall
                img='/bricks.png'
                name={path.name}
                username={path.username || null }
                rating={path.rating || 3}
                description={path.description}
              />
              </Grid>
          )}
          </Grid>
    )}





export default CategoryAllPaths
