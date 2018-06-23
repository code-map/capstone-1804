import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'
const GET_PATHS_SINGLE_USER = 'GET_PATHS_SINGLE_USER'
const GET_PATH_STEPS = 'GET_PATH_STEPS'

const SET_ALL_PATHS_IN_CATEGORY = 'SET_ALL_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'
const SET_SEARCHED_PATHS_IN_CATEGORY = 'SET_SEARCHED_PATHS_IN_CATEGORY'

/**
 * ACTION CREATORS
 */

const getSinglePath = (path) => {
  return {
    type: GET_SINGLE_PATH,
    path
  }
}

const getSingleUserPaths = (paths) => {
  return {
    type: GET_PATHS_SINGLE_USER,
    paths
  }
}

const getPathSteps = (steps) => {
  return {
    type: GET_PATH_STEPS,
    steps
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
export const getSinglePathThunk = (name) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${name}`)
    dispatch(getSinglePath(data[0]))
  }
}

export const getPathStepsThunk = (name) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${name}/steps`)
    dispatch(getPathSteps(data))
  }
}

export const getSingleUserPathsThunk = (name) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/user/${name}`)
    dispatch(getSingleUserPaths(data))
  }
}

export const getPopularPathsInCategory = (categoryId) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryId}/popular-paths`)
    dispatch(setPopularPathsInCategory(res.data))
  }
}

export const getAllPathsInCategory = (categoryId) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryId}/all-paths`)
    dispatch(setAllPathsInCategory(res.data))
  }
}

export const searchPathsInCategory = (categoryId, searchVal) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryId}/search`, searchVal)
    dispatch(setSearchedPathsInCategory(res.data))
  }
}

const initialState = {
  allUserPaths: [],
  singlePath: [],
  pathSteps: [],
  popularPathsInCategory: [],
  allPathsInCategory: [],
  searchedPathsInCategory: []
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PATH:
      return {...state, singlePath: action.path}
    case GET_PATHS_SINGLE_USER:
      return {...state, allUserPaths: action.paths}
    case GET_PATH_STEPS:
      return {...state, pathSteps: action.steps}
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
