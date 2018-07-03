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

export const getRecommendationsThunk = (resourceUid, pathUid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/search/${pathUid}/category`)
    const category = data[0]._fields[0].properties.name
    const res = await axios.get(`/api/resources/${resourceUid}/${category}/suggestions`)
    const suggestions = res.data.map(suggestion => {
      const resource = suggestion._fields[0].properties
      const { uid } = resource
      const numReviews = suggestion._fields[1].low
      const averageRating = suggestion._fields[2]
      return { resource, uid, numReviews, averageRating}
    })
    dispatch(makeSuggestions(suggestions))
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
