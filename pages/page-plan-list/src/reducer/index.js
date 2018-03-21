import { combineReducers } from 'redux';
import entities from './entities';
import plans from './plans';
import edittingPlan from './editting_plan';
import { reducer as form } from 'redux-form';

export default combineReducers({
  entities,
  plans,
  form,
  edittingPlan,
});
