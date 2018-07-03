import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
const MAKE_SUGGESTIONS = 'MAKE_SUGGESTIONS'

const setAllReviewsOfResource = (reviews) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews,
  }
}

const makeSuggestions = (suggestions) => {
  return {
    type: MAKE_SUGGESTIONS,
    suggestions
  }
}

export const getAllReviewsOfResource = (resourceName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/resources/${resourceName}/reviews`)
    dispatch(setAllReviewsOfResource(res.data))
  }
}

export const getRecommendationsThunk = (resourceUid, category) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/${resourceUid}/${category}/suggestions`)
    console.log('DATA', data)
    //dispatch(makeSuggestions())
  }
}

const initialState = {
  reviews: {},
  suggestions: []
}

export default function( state = initialState, action ){ // eslint-disable-line
  switch (action.type) {
    case SET_ALL_REVIEWS_OF_RESOURCE:
      const combinedReviews = Object.assign(state.reviews, action.reviews)
      return {...state, reviews: combinedReviews}
    case MAKE_SUGGESTIONS:
      return {...state, suggestions: action.suggestions}
    default:
      return state
  }
}
