import React, { Component } from 'react'
import { CategoryAllPaths, CategorySearch, CategoryPopularPaths } from './'
import { connect } from 'react-redux'
import { createGetSingleCategoryThunk, getPopularPathsInCategory } from '../../store'
import styled from "styled-components";
import {Link, NavLink} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import { SearchAny, PathCardSmall } from '../'


class CategorySinglePage extends Component {
  constructor() {
    super()
  }

  async componentDidMount() {
    const {categoryName} = this.props.match.params
    await this.props.getAllItemsInCategory(categoryName)
    await this.props.getPopularPaths(categoryName)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params !== this.props.match.params) {
      const {categoryName} = nextProps.match.params
      this.props.getAllItemsInCategory(categoryName)
    }
  }

  render() {
    const {paths, name} = this.props.categoryItems
    if (paths.length) {
      return (
        <Container>
          <HeaderSearchContainer>
            <Header>{name.trim()}</Header>
            <SearchBox>
              <SearchAny category={name} />
            </SearchBox>
          </HeaderSearchContainer>
          <SubHeader>{`Popular paths in ${name}`}</SubHeader>
              <CategoryAllPaths paths={this.props.popular} />
          <SubHeader>{`All paths in ${name}`}</SubHeader>
              <CategoryAllPaths paths={paths} />
          </Container>)
    } else {
      return <p>loading</p>
    }
  }
}

const mapState = state => {
  return {
    categoryItems: state.singleCategory,
    popular: state.pathReducer.popularPathsInCategory
  }
}

const mapDispatch = dispatch => {
  return {
    getAllItemsInCategory: categoryName => {
      return dispatch(createGetSingleCategoryThunk(categoryName))},
    getPopularPaths: categoryName => {
      dispatch(getPopularPathsInCategory(categoryName)) }
    }
  }


const Header = styled.h1`
  color: #55288b;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 4em;
  line-height: 0.01;
  display: inline-block;
  margin-right: 20px;
`

const HeaderSearchContainer = styled.div`
  display: flex;
  width: 60vw;
  justify-content: space-between;
  align-self: center;
  margin-top: -60px;
`

const SubHeader = styled.p`
  color: black;
  font-family: Helvetica;
  font-size: 1.2em;
  font-weight: 200;
  margin: 0;
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.13);
  padding-left: 20px;
  overflow: auto;
  background-color: rgb(232, 194, 239, 0.2);
`

const HeadlineCol = styled.div`
  margin: 20px;
  width: 90vw;
  height: 250px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.13);
  background-color: rgb(232, 194, 239, 0.2);
  align-self: center;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow: hidden;
`

const ScrollBox = styled.div`
  width: 90vw;
  height: 200px;
  overflow: scroll;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-self: center;
`

const SearchBox = styled.div`
  margin: 10px;
  width: 35vw;
  align-self: center;
  height: auto;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.13);
  padding-left: 20px;
  padding-top: 0;
  background-color: white;
  display: inline-block;
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
