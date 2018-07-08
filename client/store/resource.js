import axios from 'axios'


const MAKE_SUGGESTIONS = 'MAKE_SUGGESTIONS'
const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS'


const makeSuggestions = (suggestions) => {
  return {
    type: MAKE_SUGGESTIONS,
    suggestions
  }
}

export const clear_suggestions = () => {
  return {
    type: CLEAR_SUGGESTIONS
  }
}


export const makeSuggestionsThunk = (pathuid, resourceuid) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/resources/${pathuid}/${resourceuid}/suggestions`)
    const suggestions = data.map( suggestion => {
      const info = suggestion._fields
      const name = info[0]
      const uid = info[1]
      const url = info[2]
      const slug = info[3]
      const numReviews = info[4].low
      const stars = info[5]
      const weighted = info[6]
      return { name, uid, url, slug, numReviews, stars, weighted }
    })
    dispatch(makeSuggestions(suggestions))
  }
}

const initialState = {
  //reviews: {},
  suggestions: []
}

export default function( state = initialState, action ){ // eslint-disable-line
  switch (action.type) {
    // case SET_ALL_REVIEWS_OF_RESOURCE:
    //   const combinedReviews = Object.assign(state.reviews, action.reviews)
    //   return {...state, reviews: combinedReviews}
    case MAKE_SUGGESTIONS:
      return {...state, suggestions: action.suggestions}
    case CLEAR_SUGGESTIONS:
    return {...state, suggestions: []}
    default:
      return state
  }
}
