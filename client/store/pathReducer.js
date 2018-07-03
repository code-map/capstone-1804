import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_PATH = 'GET_SINGLE_PATH'
const GET_PATHS_SINGLE_USER = 'GET_PATHS_SINGLE_USER'
const ADD_NEW_PATH = 'ADD_NEW_PATH'
const ADD_STEP_TO_PATH = 'ADD_STEP_TO_PATH'
const DELETE_SINGLE_PATH = 'DELETE_SINGLE_PATH'

const SET_ALL_PATHS_IN_CATEGORY = 'SET_ALL_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'
const SET_POPULAR_PATHS_IN_ALL_CATEGORIES = 'SET_POPULAR_PATHS_IN_ALL_CATEGORIES'
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

const addStepToPath = (step) => {
  return {
    type: ADD_STEP_TO_PATH,
    step
  }
}

const getSinglePath = (path) => {
  return {
    type: GET_SINGLE_PATH,
    path
  }
}

const deleteSinglePath = (uid) => {
  return {
    type: DELETE_SINGLE_PATH,
    uid
  }
}

const toggleStepCompletion = (step) => {
  return {
    type: TOGGLE_STEP_COMPLETION,
    step
  }
}

const setPopularPathsInCategory = (paths) => {
  return {
    type: SET_POPULAR_PATHS_IN_CATEGORY,
    paths
  }
}

const setPopularPathsInAllCategories = (paths) => {
  return {
    type: SET_POPULAR_PATHS_IN_ALL_CATEGORIES,
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

export const addStepToPathThunk = (username, pathUid, url, form, type) => {
  return async (dispatch) => {
    const urlEncoded = encodeURIComponent(url)
    const { data } = await axios.post(`/api/paths/${pathUid}/user/${username}/step/${urlEncoded}`, {...form, type})

    // Need to update singlePath in the store with the new step
    // So that steps update on screen without refresh
    dispatch(addStepToPath(data))
  }
}

export const getSingleUserPathsThunk = (username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/all/user/${username}`)
    dispatch(getSingleUserPaths(data))
  }
}

export const getPopularPathsInAllCategories = () => {
  return async (dispatch) => {
    const res = await axios.get(`/api/paths/popular`)
    dispatch(setPopularPathsInAllCategories(res.data))
  }
}

export const deleteSinglePathThunk = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.delete(`/api/paths/${uid}`)
    dispatch(deleteSinglePath(data))
  }
}

export const getSinglePathByNameThunk = (name) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/byName/${name}`)
    dispatch(getSinglePath(data))
  }
}

export const getSinglePathByUidThunk = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${uid}`)
    dispatch(getSinglePath(data))
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

//
//
//
//
//
//
//
export const removeResourceFromPathThunk = (pathId, lastIndex, stepIndex) => {
  return async (dispatch) => {
    const { data } = await axios.post(`/api/paths/remove/${pathId}/${lastIndex}/${stepIndex}`)
    dispatch(getSinglePath(data))
  }
}

const initialState = {
  allUserPaths: [],
  singlePath: [],
  popularPathsInCategory: [],
  popularPathsInAllCategories: [],
  allPathsInCategory: [],
  searchedPathsInCategory: []
}

/**
 * REDUCER
 */
export const pathReducer = ( state = initialState, action) => { // eslint-disable-line
  switch (action.type) {
    case ADD_NEW_PATH:
      return {...state, allUserPaths: [...state.allUserPaths, action.path]}
    case DELETE_SINGLE_PATH: {
      const allUserPaths = state.allUserPaths.filter(path => path[0].details.properties.uid !== action.uid)
      return {...state, allUserPaths}
    }
    case GET_PATHS_SINGLE_USER:
      return {...state, allUserPaths: action.paths}
    case GET_SINGLE_PATH:
      return {...state, singlePath: action.path}
    case SET_POPULAR_PATHS_IN_CATEGORY:
      return {...state, popularPathsInCategory: action.paths}
    case SET_POPULAR_PATHS_IN_ALL_CATEGORIES:
      return {...state, popularPathsInAllCategories: action.paths}
    case SET_ALL_PATHS_IN_CATEGORY:
      return {...state, allPathsInCategory: action.paths}
    case SET_SEARCHED_PATHS_IN_CATEGORY:
      return {...state, searchedPathsInCategory: action.paths}
    default:
      return state
  }
}
