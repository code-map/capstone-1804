import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_PATHS_SINGLE_USER = 'GET_PATHS_SINGLE_USER'
const ADD_NEW_PATH = 'ADD_NEW_PATH'
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'

const SET_ALL_PATHS_IN_CATEGORY = 'SET_ALL_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'
const SET_SEARCHED_PATHS_IN_CATEGORY = 'SET_SEARCHED_PATHS_IN_CATEGORY'

/**
 * ACTION CREATORS
 */
const getSingleUserPaths = (paths) => {
  return {
    type: GET_PATHS_SINGLE_USER,
    paths
  }
}

const addNewPath = (path) => {
  return {
    type: ADD_NEW_PATH,
    path
  }
}

const getSinglePath = (path) => {
  return {
    type: GET_SINGLE_PATH,
    path
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
export const addNewPathThunk = (path) => {
  return async (dispatch) => {
    const { data } = await axios.post('/api/paths', path)
    dispatch(addNewPath(data))
  }
}

export const getSingleUserPathsThunk = (username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/all/user/${username}`)
    dispatch(getSingleUserPaths(data))
  }
}

export const getSinglePathThunk = (pathName) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${pathName}`)
    dispatch(getSinglePath(data))
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
  popularPathsInCategory: [],
  allPathsInCategory: [],
  searchedPathsInCategory: []
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_PATH:
      return {...state, allUserPaths: [...state.allUserPaths, action.path]}
    case GET_PATHS_SINGLE_USER:
      return {...state, allUserPaths: action.paths}
    case GET_SINGLE_PATH:
      return {...state, singlePath: action.path}
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
