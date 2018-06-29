import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import  Grid from '@material-ui/core/Grid'
import { getAllPathsInCategory } from '../../store'
import {PathCardSmallCategory} from '../paths'
import styled from "styled-components";

const Display = styled.div`
  display: flex;
  width: 100vw;
  flex-wrap: nowrap;
`

const CategoryAllPaths = (props) => {
  const {paths} = props
  return(
    <Display>
      {paths.map((path) =>
        <PathCardSmallCategory
          key={path.uid}
          url={path.url}
          uid={path.uid}
          slug={path.slug}
          img='/squares-default.png'
          name={path.name}
          username={path.username || null }
          rating={path.rating || 0}
          description={path.description}
        />
      )}
    </Display>
  )
}

export default CategoryAllPaths
