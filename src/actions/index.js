import axios from 'axios';

export const FETCH_REPO = 'FETCH_REPO';

const ROOT_URL = 'https://www......'; //the root url
const API_KEY = 'asdfasdfasdf';

/**
 * Format the get request and return an action with the type
 * FETCH_REPO.
 * @param  {string} gitURL - the url of the repo
 * @return {Object} The action
 */
export function fetchRepo(gitURL) {
  const request = axios.get(/* formatted request url */);

  return {
    type: FETCH_REPO,
    payload: request
  };
}
