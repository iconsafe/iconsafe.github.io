import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers/index'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer,
  storeEnhancers(applyMiddleware(thunk)))

export default store

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
})
