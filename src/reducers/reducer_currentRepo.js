import { FETCH_REPO } from '../actions/index';
import currentRepo from './gitGraphDemo/jsonToGitGraph';

const INITIAL_STATE = currentRepo;

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_REPO:
      console.log(action.payload.data);
      return action.payload.data;
    default:
      return state;
  }
}
