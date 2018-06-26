import axios from 'axios'

/**
 * ACTION TYPES
 */
const SEARCH_FOR_CATEGORY = 'SEARCH_FOR_CATEGORY'
const SET_POPULAR_CATEGORIES = 'SET_POPULAR_CATEGORIES'





/**
 * INITIAL STATE
 */
const initialState = {
  foundCategories: [],
  popularCategories: [],
}


/**
 * ACTION CREATORS
 */
const setPopularCategoriesAC = (popularCategories) => {
  return {
    type: SET_POPULAR_CATEGORIES,
    popularCategories,
  }
}


/**
 * THUNK CREATORS
 */
export const getPopularCategoriesThunk = () => {
  return async (dispatch) => {
    const res = await axios.get('/api/categories/popular')
    dispatch(setPopularCategoriesAC(res.data))
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_FOR_CATEGORY:
      return {...state, foundCategories: action.foundCategories}
    case SET_POPULAR_CATEGORIES:
      return {...state, popularCategories: action.popularCategories}
    default:
      return state
  }
}
