import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_PATHS_SINGLE_USER = 'GET_PATHS_SINGLE_USER'

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

export const getSingleUserPathsThunk = (username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/all/user/${username}`)
    dispatch(getSingleUserPaths(data))
  }
}

export const getPopularPathsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/popular-paths`)
    dispatch(setPopularPathsInCategory(res.data))
  }
}

export const getAllPathsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/all-paths`)
    dispatch(setAllPathsInCategory(res.data))
  }
}

export const getAllItemsInCategory = (categoryName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/search`)
    dispatch(returnAllItemsInCategory(res.data))
  }
}

export const searchPathsInCategory = (categoryName, searchVal) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/categories/${categoryName}/search`, searchVal)
    dispatch(setSearchedPathsInCategory(res.data))
  }
}

const initialState = {
  allUserPaths: [],
  popularPathsInCategory: [],
  allPathsInCategory: [],
  searchedPathsInCategory: []
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => {
  switch (action.type) {
    case GET_PATHS_SINGLE_USER:
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
