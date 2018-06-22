import axios from 'axios'

/**
 * ACTION TYPES
 */

const SET_POPULAR_PATHS_IN_CATEGORY = 'SET_POPULAR_PATHS_IN_CATEGORY'

/**
 * INITIAL STATE
 */

const defaultState = {
  popularPaths: []
}

/**
 * ACTION CREATORS
 */

export const setPopularPathsInCategory = (popularPaths) => {
  return {
  type: SET_POPULAR_PATHS_IN_CATEGORY,
  popularPaths,
  }
}

/**
 * THUNK CREATORS
 */

export const getPopularPathsInCategory = (categoryId) => {
  return async (dispatch) => {
    console.log('is our thunk being hit')
    const res = await axios.get(`/api/category/${categoryId}/popular-paths`)
    const popularPaths = res.data
    console.log('res.data is ', res.data)
    dispatch(setPopularPathsInCategory(popularPaths))
  }

}
/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case SET_POPULAR_PATHS_IN_CATEGORY:
      return {...state, popularPaths: action.popularPaths}
    default:
      return state
  }
}
