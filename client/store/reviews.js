import axios from 'axios'

const SET_ALL_REVIEWS_OF_RESOURCE = 'SET_ALL_REVIEWS_OF_RESOURCE'
const GOT_USER_RESOURCE_REVIEW = 'GOT_USER_RESOURCE_REVIEW'

const setAllReviewsOfResource = (reviews, uid) => {
  return {
    type: SET_ALL_REVIEWS_OF_RESOURCE,
    reviews,
    uid
  }
}

const gotUserResourceReview = (rating) => {
  return {
    type: GOT_USER_RESOURCE_REVIEW,
    rating
  }
}

export const getAllReviewsOfResource = (uid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/resources/${uid}/reviews`)
    dispatch(setAllReviewsOfResource(data))
  }
}

export const addResourceReview = (rating) => {
  return async (dispatch) => {
    await axios.post(`/api/userAuth/reviews/review`, rating)
  }
}

export const getUserResourceReview = (body) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/userAuth/reviews/resource/${body.resourceUid}/user/${body.userUid}`)
    console.log('getUserResourceReview ****', data)
    // dispatch(gotUserResourceReview(data[0]))
  }
}

const getAverageReviewRating = (reviews) => {
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
  resourceReviewRating: 0
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
    case GOT_USER_RESOURCE_REVIEW: {
      let resourceReviewRating = action.rating.low ? action.rating.low : action.rating

      return {...state, resourceReviewRating}
    }
    default:
      return state
  }
}
