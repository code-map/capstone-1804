import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STEP_COMPLETIONS_FOR_USER = 'GET_STEP_COMPLETIONS_FOR_USER'
const TOGGLE_STEP_COMPLETION = 'TOGGLE_STEP_COMPLETION'

/**
 * ACTION CREATORS
 */
const getStepCompletionSingleUser = (completed) => {
  return {
    type: GET_STEP_COMPLETIONS_FOR_USER,
    completed
  }
}

const toggleStepCompletion = (stepUrl) => {
  return {
    type: TOGGLE_STEP_COMPLETION,
    stepUrl
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

export const toggleStepCompletionThunk = (pathName, username, stepUrl, bool) => {
  return async (dispatch) => {
    const urlEncoded = encodeURIComponent(stepUrl);

    await axios.put(`/api/paths/${pathName}/user/${username}/status/${bool}/step/${urlEncoded}`)

    dispatch(toggleStepCompletion(stepUrl))
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
    case TOGGLE_STEP_COMPLETION: {
      const completedSteps = state.completedSteps.map((step) => {
        if(step.stepUrl === action.stepUrl){
          step.completed = !step.completed
        }
        return step
      })
      return {...state, completedSteps}
    }
    default:
      return state
  }
}
