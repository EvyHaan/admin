import {
  makeConstant
} from "../../utils";
const STATE_BRANCH = 'MOCS';

export const GET_MOCS = makeConstant(STATE_BRANCH, 'GET_MOCS');
export const GET_MOCS_SUCCESS = "GET_MOCS_SUCCESS";
export const GET_MOCS_FAILED = "GET_MOCS_FAILED";
export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export const ADD_CANDIDATE_SUCCESS = 'ADD_CANDIDATE_SUCCESS';
export const ADD_CANDIDATE_FAILURE = 'ADD_CANDIDATE_FAILURE';
export const GET_CONGRESS_BY_SESSION = makeConstant(STATE_BRANCH, 'GET_CONGRESS_BY_SESSION');
export const GET_CONGRESS_BY_SESSION_SUCCESS = makeConstant(STATE_BRANCH, 'GET_CONGRESS_BY_SESSION_SUCCESS');
export const GET_CONGRESS_BY_SESSION_FAILED = makeConstant(STATE_BRANCH, 'GET_CONGRESS_BY_SESSION_FAILED');
