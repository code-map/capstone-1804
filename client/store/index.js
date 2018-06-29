import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import category from './category'
import {pathReducer} from './pathReducer'
import step from './step'
import singleCategory from './single-category'
import resource from './resource'
import searchMatches from './search'

const reducer = combineReducers({
  user,
  pathReducer,
  category,
  step,
  singleCategory,
  resource,
  searchMatches
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './category'
export * from './pathReducer'
export * from './step'
export * from './single-category'
export * from './resource'
export * from './search'
