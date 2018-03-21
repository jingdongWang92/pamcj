import { handleActions } from 'redux-actions';
import * as constants from '../constants';


export default handleActions({
  [constants.ACCESS_TOKEN_READ_SUCCESS]: (state, action) => action.payload,
}, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMCIsImlhdCI6MTUxMTk1MDU4MiwibmJmIjoxNTExOTUwNTgyLCJleHAiOjE1OTgzNTA1ODIsImlzcyI6IjIwIiwianRpIjoiWGtvY2ppWU9yRFRCck1WTH5wME84In0.knuvAjJ-_BpI1lSA_P23A3bl2in0vPeY0HpS4BrIvUQ');
