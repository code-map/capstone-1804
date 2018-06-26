import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STEP_COMPLETIONS_FOR_USER = 'GET_STEP_COMPLETIONS_FOR_USER'

/**
 * ACTION CREATORS
 */
const getStepCompletionSingleUser = (completed) => {
  return {
    type: GET_STEP_COMPLETIONS_FOR_USER,
    completed
  }
}

/**
 * THUNK CREATORS
 */
export const getStepCompletionSingleUserThunk = (pathName, username) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${pathName}/user/${username}/completed`)
    dispatch(getStepCompletionSingleUser(data))
  }
}

/**
 * REDUCER
 */
const initialState = {
  completedSteps: []
}

export default function( state = initialState, action) {
  switch (action.type) {
    case GET_STEP_COMPLETIONS_FOR_USER:
      return {...state, completedSteps: action.completed}
    default:
      return state
  }
}
