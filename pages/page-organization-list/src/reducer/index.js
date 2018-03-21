import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import entities from './entities';
import edittingOrganization from './editting_organization';
import organizationInvitations from './organization_invitations';
import isCreating from './is_creating';
import isUpdating from './is_updating';
import mode from './mode';
import myself from './myself';
import organizations from './organizations';
import isLoading from './is_loading';
import tablePagination from './table_pagination';
import interactiveOrganization from './interactive_organization';


export default combineReducers({
  form,
  entities,
  edittingOrganization,
  organizationInvitations,
  isCreating,
  isUpdating,
  mode,
  myself,
  organizations,
  isLoading,
  tablePagination,
  interactiveOrganization,
});
