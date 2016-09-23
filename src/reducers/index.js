import { combineReducers } from 'redux';
import RepoReducer from './reducer_currentRepo';

const rootReducer = combineReducers({
  currentRepo: RepoReducer,
});

export default rootReducer;
