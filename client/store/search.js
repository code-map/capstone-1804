import axios from 'axios'


const SEARCH_ANY = 'SEARCH_ANY'

const initialState = {
    matches: []
}

const matchEverything = (matches) => {
  return {
    type: SEARCH_ANY,
    matches
  }
}

export const createFuzzyMatchThunk = (searchString) => {
  return async (dispatch) => {
      const response = await axios.post(`/api/search`, {searchString})
      const matches = response.data.map(item => {
      const rating = item._fields[1]
      const {labels, properties} = item._fields[0]
      const {name, url} = properties
      return {type: labels[0], name, url, rating}
     })
     dispatch(matchEverything(matches))
   }
}

export const createMatchAllInCategoryThunk = (searchString, category) => {
  return async (dispatch) => {
      const response = await axios.post(`/api/categories/${category}/search`, {searchString})
      const matches = response.data.map(item => {
      const rating = item._fields[1]
      const {labels, properties} = item._fields[0]
      const {name, url} = properties
      return {type: labels[0], name, url, rating}
     })
     dispatch(matchEverything(matches))
   }
}


export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ANY:
        return action.matches
    default:
      return state
  }
}
