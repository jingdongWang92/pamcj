import { combineReducers } from 'redux';
import entities from './entities';
import user from './user';
import plans from './plans';
import selectedPlan from './selected-plan';
import selectedPayMethod from './selected-pay-method';
import selectedOrganization from './selected-organization';
import wxpayInfo from './wxpay-info';
import order from './order';
import step from './step';
import organizations from './organizations';


export default combineReducers({
  entities,
  user,
  plans,
  selectedPlan,
  selectedPayMethod,
  selectedOrganization,
  wxpayInfo,
  order,
  step,
  organizations,
});
