import axios from 'axios'

/**
 * ACTION TYPES
 */
const SEARCH_FOR_CATEGORY = 'SEARCH_FOR_CATEGORY'
const GET_ALL_PARENT_CATEGORIES = 'GET_ALL_PARENT_CATEGORIES'

/**
 * ACTION CREATORS
 */
const getAllParentCategories = (categories) => {
  return {
    type: GET_ALL_PARENT_CATEGORIES,
    categories
  }
}

/**
 * THUNK CREATORS
 */
export const getAllParentCategoriesThunk = () => {
  return async (dispatch) => {
    const { data } = await axios.get('/api/categories/all/parent')
    dispatch(getAllParentCategories(data))
  }
}

/**
 * REDUCER
 */

const initialState = {
  foundCategories: [],
  allParentCategories: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_FOR_CATEGORY:
      return {...state, foundCategories: action.foundCategories}
    case GET_ALL_PARENT_CATEGORIES:
      return {...state, allParentCategories: action.categories}
    default:
      return state
  }
}
