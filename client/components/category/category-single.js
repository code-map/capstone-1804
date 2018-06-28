import React, { Component } from 'react'
import { CategoryAllPaths, CategorySearch, CategoryPopularPaths } from './'
import { connect } from 'react-redux'
import { createGetSingleCategoryThunk } from '../../store'
import styled from "styled-components";
import {Link, NavLink} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import { SearchAny } from '../'


class CategorySinglePage extends Component {
  constructor(){
    super()
  }

  async componentDidMount(){
    const { categoryName } = this.props.match.params
    await this.props.getAllItemsInCategory(categoryName)
  }


  render() {
    const { paths, resources, name, url } = this.props.categoryItems
    if(paths.length) {
      return(
        <Container>
          <HeaderSearchContainer>
          <Header>{name.trim()}</Header>
          <SearchBox>
            <SearchAny category={name}/>
        </SearchBox>
        </HeaderSearchContainer>
        <HeadlineCol>
          <SubHeader>Popular paths in Javascript</SubHeader>
        <ScrollBox>
          <CategoryAllPaths paths={paths}/>
        </ScrollBox>
        </HeadlineCol>
        <Headline>
          <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
            <ListContainer>
            <SubHeader style={{marginTop:'15px'}}>Popular resources in Javascript</SubHeader>
              <div>
              {
                resources.map((resource) => {
                  return <p key={resource.name}><a  href={resource.url}>{resource.name}</a></p>
                })
              }
              </div>
            </ListContainer>
            </Grid>
          <Grid item xs={12} sm={6}>
          <ListContainer>
          <SubHeader style={{marginTop:'15px'}}>All paths in Javascript</SubHeader>
              <div>
              {
                paths.map((path) => {
                  return(<p key={path.uid}><NavLink to={`/paths/${path.uid}/${path.slug}`} >{path.name}</NavLink></p>)
                })
              }
              </div>
            </ListContainer>
            </Grid>
            </Grid>
            </Headline>
        </Container>
      )
    }else{
      return <p>loading</p>
    }

  }
}


const mapState = (state) => {
  return({
    categoryItems: state.singleCategory
  })
}

const mapDispatch = (dispatch) => {
  return({
    getAllItemsInCategory : (categoryName) => {
      return dispatch(createGetSingleCategoryThunk(categoryName))
    }
  })
}

const Header = styled.h1`
  color: #55288B;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 4em;
  line-height: .01;
  display: inline-block;
  margin-right: 20px
`

const HeaderSearchContainer = styled.div`
  display: flex;
  width: 60vw;
  justify-content: space-between;
  align-self: center;
  margin-top: -60px
`

const SubHeader = styled.p`
  color: black;
  font-family: Helvetica;
  font-size: 1.2em;
  font-weight: 200;
  margin: 0
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 95vw;
  margin-top: 50px
  padding: 50px;
  box-sizing: border-box;
`

const Headline = styled.div`
margin: 10px;
width: auto;
height: auto;
box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.13);
padding-left: 20px;
overflow:auto;
background-color: rgb(232, 194, 239, .2)
`

const HeadlineCol = styled.div`
margin: 20px;
width: 90vw;
height: 250px;
box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.13);
background-color: rgb(232, 194, 239, .2);
align-self: center;
display: flex;
flex-direction: column;
padding: 15px;
overflow: hidden

`

const ScrollBox = styled.div`
width: 90vw;
height: 200px;
overflow: scroll;
display: flex;
flex-wrap: nowrap;
justify-content: center;
align-self: center

`

const SearchBox = styled.div`
margin: 10px;
width: 35vw;
align-self: center;
height: auto;
box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.13);
padding-left: 20px;
padding-top: 0;
background-color: white;
display: inline-block
`

const ListContainer = styled.div`
  width: auto;
  height: auto;
`

export default connect(mapState, mapDispatch)(CategorySinglePage)













//ORIGINAL SCROLL BOX, DO NOT DELETE!!!!!
// const ScrollBox = styled.div`
// margin: 10px;
// width: 90vw;
// height: 200px;
// box-shadow: 0 1px 1px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.13);
// background-color: rgb(232, 194, 239, .2);
// align-self: center;
// overflow: scroll;
// display: flex;
// flex-wrap: nowrap;
// justify-content: center;
// `
