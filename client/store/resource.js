import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'

const setAllReviewsOfResource = (reviews, idx) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews,
  }
}

export const getAllReviewsOfResource = (resourceName) => {
  return async (dispatch) => {
    const res = await axios.get(`/api/resources/${resourceName}/reviews`)
    dispatch(setAllReviewsOfResource(res.data))
  }
}

const initialState = {
  reviews: [],
}

export default function( state = initialState, action ){ // eslint-disable-line
  switch (action.type) {
    case SET_ALL_REVIEWS_OF_RESOURCE:
      return {...state, reviews: action.reviews}
    default:
      return state
  }
}
