import React from 'react'
import { PopularCategories } from './category'
import { SearchAny } from './'
import { PopularPaths } from './paths'
import styled from "styled-components"

const HomeContainer = styled.div`
  width: 100vw
  display: flex
  justify-content: center
  margin: 0
  box-sizing: border-box
`

const ContetContainer = styled.div`
  width: 90vw
  align-self: center
`
const HomePage = () => {
  return(
    <HomeContainer>
    <ContetContainer>
      <h1>
        What do you want to learn today?
      </h1>
      <SearchAny />
      <h3>
        Popular Topics:
      </h3>
      <PopularCategories />
      <h3>
        Popular Paths:
      </h3>
      <PopularPaths />
    </ContetContainer>
    </HomeContainer>
  )
}

export default HomePage
