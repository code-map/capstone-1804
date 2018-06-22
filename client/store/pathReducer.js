import { pathsDemo } from './path_demo_data'

/**
 * ACTION TYPES
 */
const GET_ALL_PATHS = 'GET_ALL_PATH'
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'
const GET_USER_PATHS = 'GET_USER_PATHS'

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

const initialState = {
  allPaths: [],
  allUserPaths: [],
  singlePath: {}
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
    default:
      return state
  }
}
