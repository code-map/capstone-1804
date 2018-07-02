import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
const REVIEW_RESOURCE = 'REVIEW_RESOURCE'

const setAllReviewsOfResource = (reviews, uid) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews,
    uid
  }
}

const reviewResource = (review) => {
  return {
    type: REVIEW_RESOURCE,
    review
  }
}

export const getAllReviewsOfResource = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/resources/${uid}/reviews`)
    dispatch(setAllReviewsOfResource(data))
  }
}

export const addResourceReview = (rating) => {
  const urlEncoded = encodeURIComponent(rating.resourceUrl)

  return async (dispatch) => {
    await axios.post(`/api/userAuth/resources/${urlEncoded}/review`, rating)
    dispatch(reviewResource(rating))
  }
}

const getAverageReviewRating = (reviews) => {

  console.log('getAverageReviewRating', reviews.data)

  let ratingTotal = 0

  if(reviews.data.length > 0){
    ratingTotal = reviews.data.reduce((acc, review) => {
      if(review.score.low){
        return acc + review.score.low
      } else {
        return acc + review.score
      }
    }, 0)

    return ratingTotal / reviews.data.length
  } else {
    return 0
  }
}

const initialState = {
  allResourceReviews: [],
  // lastRating: []
}

export default function( state = initialState, action ){
  switch (action.type) {
    case SET_ALL_REVIEWS_OF_RESOURCE: {
      const totalAvg = getAverageReviewRating(action.reviews)
      const totalReviews = action.reviews.data.length

      const result = {
        resource: {...action.reviews, totalAvg, totalReviews}
      }

      return {
        ...state,
        allResourceReviews: [...state.allResourceReviews, result]
      }
    }
    // case REVIEW_RESOURCE:
    //   return {...state, lastRating: action.rating}
    default:
      return state
  }
}
