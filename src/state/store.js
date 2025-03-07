import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import axios from "axios";

import events from './events';
import mocs from './mocs';
import users from './users';
import selections from './selections';
import rsvps from './rsvps';
import researchers from './researchers';

import { firebaseUrl } from '../state/constants';
import {
  firebasedb,
} from '../utils/firebaseinit';

const reducers = {
  events: events.reducers,
  mocs: mocs.reducers,
  users: users.reducers,
  researchers: researchers.reducers,
  rsvps: rsvps.reducers,
  selections: selections.reducers,
};

const logics = [
  ...events.logics,
  ...users.logics,
  ...mocs.logics,
  ...selections.logics,
  ...rsvps.logics,
  ...researchers.logics,
];

const reduxLogicDependencies = {
  firebaseUrl: firebaseUrl,
  firebasedb,
  httpClient: axios,
};

const logicMiddleware = createLogicMiddleware(logics, reduxLogicDependencies);

const middleware = applyMiddleware(
  logicMiddleware
);

export default () => {
  const store = createStore(
    combineReducers(reducers),
    middleware
  );

  return store;
};