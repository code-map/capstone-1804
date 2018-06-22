import axios from 'axios'

/**
 * ACTION TYPES
 */
const SEARCH_FOR_CATEGORY = 'SEARCH_FOR_CATEGORY'

/**
 * INITIAL STATE
 */
const initialState = {
  foundCategories: [],
}


/**
 * ACTION CREATORS
 */


/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_FOR_CATEGORY:
      return {...state, foundCategories: action.foundCategories}
    default:
      return state
  }
}
