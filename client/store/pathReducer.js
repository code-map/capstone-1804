import { pathsDemo } from './path_demo_data'
import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_PATHS = 'GET_ALL_PATH'
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'
const GET_USER_PATHS = 'GET_USER_PATHS'

const SET_ALL_PATHS_IN_CATEGORY = 'SET_ALL_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'
const SET_SEARCHED_PATHS_IN_CATEGORY = 'SET_SEARCHED_PATHS_IN_CATEGORY'

/**
 * ACTION CREATORS
 */
const getAllPaths = (paths) => {
  return {
    type: GET_ALL_PATHS,
    paths
  }
}

const getSinglePath = (path) => {
  return {
    type: GET_SINGLE_PATH,
    path
  }
}

const getSingleUserPaths = (paths) => {
  return {
    type: GET_USER_PATHS,
    paths
  }
}

const setPopularPathsInCategory = (paths) => {
  return {
    type: SET_POPULAR_PATHS_IN_CATEGORY,
    paths
  }
}

const setAllPathsInCategory = (paths) => {
  return {
    type: SET_ALL_PATHS_IN_CATEGORY,
    paths
  }
}

const setSearchedPathsInCategory = (paths) => {
  return {
    type: SET_SEARCHED_PATHS_IN_CATEGORY,
    paths
  }
}

/**
 * THUNK CREATORS
 */
export const getAllPathsThunk = () => {
  return async (dispatch) => {
    const data = await pathsDemo
    dispatch(getAllPaths(data))
  }
}

export const getSinglePathThunk = (id) => {
  return async (dispatch) => {
    const data = await pathsDemo

    const singlepath = data.filter((item) => {
      return item.id === id
    })

    dispatch(getSinglePath(singlepath[0]))
  }
}

export const getSingleUserPathsThunk = (userId) => {
  return async (dispatch) => {
    const data = await pathsDemo

    const singleUserPaths = data.filter((item) => {
      return item.userId === userId
    })

    dispatch(getSingleUserPaths(singleUserPaths))
  }
}

export const getPopularPathsInCategory = (categoryId) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/category/${categoryId}/popular-paths`)
    dispatch(setPopularPathsInCategory(res.data))
  }
}

export const getAllPathsInCategory = (categoryId) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/category/${categoryId}/all-paths`)
    dispatch(setAllPathsInCategory(res.data))
  }
}

export const searchPathsInCategory = (categoryId, searchVal) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/category/${categoryId}/search`, searchVal)
    dispatch(setSearchedPathsInCategory(res.data))
  }
}

const initialState = {
  allPaths: [],
  allUserPaths: [],
  singlePath: {},
  popularPathsInCategory: [],
  allPathsInCategory: [],
  searchedPathsInCategory: [],
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PATHS:
      return {...state, allPaths: action.paths}
    case GET_SINGLE_PATH:
      return {...state, singlePath: action.path}
    case GET_USER_PATHS:
      return {...state, allUserPaths: action.paths}
    case SET_POPULAR_PATHS_IN_CATEGORY:
      return {...state, popularPathsInCategory: action.paths}
    case SET_ALL_PATHS_IN_CATEGORY:
      return {...state, allPathsInCategory: action.paths}
    case SET_SEARCHED_PATHS_IN_CATEGORY:
      return {...state, searchedPathsInCategory: action.paths}
    default:
      return state
  }
}
