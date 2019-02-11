import { createStore, applyMiddleware } from 'redux';
import messageReducer from './reducers/messageReducer';
import thunk from 'redux-thunk';

const store = createStore(
    messageReducer,
    applyMiddleware(thunk)
)
export default store;