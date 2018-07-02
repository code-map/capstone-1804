import axios from 'axios'

//const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
//const REVIEW_RESOURCE = 'REVIEW_RESOURCE'
const REVIEW_PATH = 'REVIEW_PATH'
const GET_CURRENT_PATH_REVIEW = 'GET_CURRENT_PATH_REVIEW'

// const setAllReviewsOfResource = (reviews) => {
//   return {
//     type: SET_ALL_REVIEWS_OF_RESOURCE,
//     reviews,
//   }
// }

// const reviewResource = (review) => {
//   return {
//     type: REVIEW_RESOURCE,
//     review
//   }
// }

const reviewPath = (review) => {
  return {
    type: REVIEW_PATH,
    review
  }
}

const getCurrentPathReview = (review) => {
  return {
    type: GET_CURRENT_PATH_REVIEW,
    review
  }

}

// export const getAllReviewsOfResource = (uid) => {
//   return async (dispatch) => {
//     const res = await axios.get(`/api/resources/${uid}/reviews`)
//     dispatch(setAllReviewsOfResource(res.data))
//   }
// }

// export const addResourceReview = (rating) => {
//   const urlEncoded = encodeURIComponent(rating.resourceUrl)

//   return async (dispatch) => {
//     await axios.post(`/api/userAuth/resources/${urlEncoded}/review`, rating)
//     dispatch(reviewResource(review))
//   }
// }

export const getCurrentPathReviewThunk = (username, pathuid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/paths/${pathuid}/${username}/get-review`)
    const score = data.records[0]._fields[0]
    const comments = data.records[0]._fields[1]
    dispatch(getCurrentPathReview({score, comments}))
  }
}

export const addPathReviewThunk = (username, pathuid, ratingText, ratingStars) => {
  return async (dispatch) => {
    const { data } = await axios.post(`/api/paths/${pathuid}/rate-path`, {username, pathuid, ratingText, ratingStars})
    const {score, comments} = data.records[0]._fields[0].properties
    dispatch(reviewPath({score, comments}))
  }
}

const initialState = {
  //resourceReviews: [],
  pathReview: {}
  //lastRating: []
}

export default function( state = initialState, action ){ // eslint-disable-line
  switch (action.type) {
    // case SET_ALL_REVIEWS_OF_RESOURCE: {
    //   const combinedReviews = Object.assign(state.reviews, action.reviews)
    //   return {...state, reviews: combinedReviews}
    // }
    // case REVIEW_RESOURCE:
    //   return {...state, lastRating: action.rating}
    case GET_CURRENT_PATH_REVIEW:
      return {...state, pathReview: action.review}
    case REVIEW_PATH:
      return {...state, pathReview: action.review}
    default:
      return state
  }
}
