import { combineReducers } from 'redux';
import CurrentAddressReducer from './CurrentAddressReducer.js';
import OrderReducer from './OrderReducer.js';

const allReducers = combineReducers({
  current_location:CurrentAddressReducer,
  order:OrderReducer,
  
});

export default allReducers;