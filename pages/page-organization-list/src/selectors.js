import { createStructuredSelector, createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import * as schemas from './schemas';


export const getOrganizations = state => denormalize(state.organizations, schemas.organizations, state.entities);


export const getOrganizationInvitations = state => denormalize(state.organizationInvitations, schemas.organizationInvitations, state.entities);


export const getEdittingOrganization = state => denormalize(state.edittingOrganization, schemas.organization, state.entities);


export const getMyself = state => denormalize(state.myself, schemas.user, state.entities);


export const getFormattedOrganizations = createSelector(
  getOrganizations,
  getMyself,
  (organizations, myself) => {
    if (!myself) { return organizations; }

    return organizations.map(organization => {
      const member = organization.members.find(user => user.id === myself.id);
      organization.relationship_with_me = member.organization_member;

      return organization;
    });
  },
);


export const getMode = state => state.mode;


export const isCreating = state => state.isCreating;


export const getInteractiveOrganization = state => denormalize(state.interactiveOrganization, schemas.organization, state.entities);


export const isLoading = state => state.isLoading;


export const isUpdating = state => state.isUpdating;


export const mapStateToProps = createStructuredSelector({
  organizationInvitations: getOrganizationInvitations,
  edittingOrganization: getEdittingOrganization,
  organizations: getFormattedOrganizations,
  mode: getMode,
  isCreating,
  interactiveOrganization: getInteractiveOrganization,
  myself: getMyself,
  isLoading,
  isUpdating,
});
