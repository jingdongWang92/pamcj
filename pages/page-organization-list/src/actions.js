import { createAction } from 'redux-actions';
import * as constants from './constants';
import * as schemas from './schemas';
import { normalize } from 'normalizr';


export const searchOrganizations = createAction(constants.ORGANIZATIONS_SEARCH);
export const searchOrganizationsSuccess = createAction(constants.ORGANIZATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizations),
  res => res.meta,
);
export const searchOrganizationsFailed = createAction(constants.ORGANIZATIONS_SEARCH_FAILED);


export const searchOrganizationMembers = createAction(constants.ORGANIZATION_MEMBERS_SEARCH);
export const searchOrganizationMembersSuccess = createAction(constants.ORGANIZATION_MEMBERS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.users),
);
export const searchOrganizationMembersFailed = createAction(constants.ORGANIZATION_MEMBERS_SEARCH_FAILED);


export const searchOrganizationInvitations = createAction(constants.ORGANIZATION_INVITATIONS_SEARCH);
export const searchOrganizationInvitationsSuccess = createAction(constants.ORGANIZATION_INVITATIONS_SEARCH_SUCCESS,
  res => normalize(res.payload, schemas.organizationInvitations),
);
export const searchOrganizationInvitationsFailed = createAction(constants.ORGANIZATION_INVITATIONS_SEARCH_FAILED);


export const createOrganization = createAction(constants.ORGANIZATION_CREATE);
export const createOrganizationSuccess = createAction(constants.ORGANIZATION_CREATE_SUCCESS,
  res => normalize(res.payload, schemas.organization),
);
export const createOrganizationFailed = createAction(constants.ORGANIZATION_CREATE_FAILED);


export const createOrganizationInvitation = createAction(constants.ORGANIZATION_INVITATION_CREATE);
export const createOrganizationInvitationSuccess = createAction(constants.ORGANIZATION_INVITATION_CREATE_SUCCESS,
  organizationInvitation => normalize(organizationInvitation, schemas.organizationInvitation),
);
export const createOrganizationInvitationFailed = createAction(constants.ORGANIZATION_INVITATION_CREATE_FAILED);


export const updateOrganization = createAction(constants.ORGANIZATION_UPDATE);
export const updateOrganizationSuccess = createAction(constants.ORGANIZATION_UPDATE_SUCCESS,
  res => normalize(res.payload, schemas.organization),
);
export const updateOrganizationFailed = createAction(constants.ORGANIZATION_UPDATE_FAILED);


export const removeOrganization = createAction(constants.ORGANIZATION_REMOVE);
export const removeOrganizationSuccess = createAction(constants.ORGANIZATION_REMOVE_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const removeOrganizationFailed = createAction(constants.ORGANIZATION_REMOVE_FAILED);


export const editOrganization = createAction(constants.ORGANIZATION_EDIT);
export const editOrganizationSuccess = createAction(constants.ORGANIZATION_EDIT_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const editOrganizationFailed = createAction(constants.ORGANIZATION_EDIT_FAILED);


export const acceptOrganizationInvitation = createAction(constants.ORGANIZATION_INVITATION_ACCEPT);
export const acceptOrganizationInvitationSuccess = createAction(constants.ORGANIZATION_INVITATION_ACCEPT_SUCCESS,
  organizationInvitation => normalize(organizationInvitation, schemas.organizationInvitation),
);
export const acceptOrganizationInvitationFailed = createAction(constants.ORGANIZATION_INVITATION_ACCEPT_FAILED);


export const rejectOrganizationInvitation = createAction(constants.ORGANIZATION_INVITATION_REJECT);
export const rejectOrganizationInvitationSuccess = createAction(constants.ORGANIZATION_INVITATION_REJECT_SUCCESS,
  organizationInvitation => normalize(organizationInvitation, schemas.organizationInvitation),
);
export const rejectOrganizationInvitationFailed = createAction(constants.ORGANIZATION_INVITATION_REJECT_FAILED);


export const quitOrganization = createAction(constants.ORGANIZATION_QUIT);
export const quitOrganizationSuccess = createAction(constants.ORGANIZATION_QUIT_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const quitOrganizationFailed = createAction(constants.ORGANIZATION_QUIT_FAILED);


export const fetchUserSelf = createAction(constants.USER_SELF_FETCH);
export const fetchUserSelfSuccess = createAction(constants.USER_SELF_FETCH_SUCCESS,
  user => normalize(user, schemas.user),
);
export const fetchUserSelfFailed = createAction(constants.USER_SELF_FETCH_FAILED);


export const addOrganization = createAction(constants.ORGANIZATION_ADD);
export const addOrganizationSuccess = createAction(constants.ORGANIZATION_ADD_SUCCESS);
export const addOrganizationFailed = createAction(constants.ORGANIZATION_ADD_FAILED);


export const viewOrganization = createAction(constants.ORGANIZATION_VIEW);
export const viewOrganizationSuccess = createAction(constants.ORGANIZATION_VIEW_SUCCESS);
export const viewOrganizationFailed = createAction(constants.ORGANIZATION_VIEW_FAILED);


export const addOrganizationInvitation = createAction(constants.ORGANIZATION_INVITATION_ADD);
export const addOrganizationInvitationSuccess = createAction(constants.ORGANIZATION_INVITATION_ADD_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const addOrganizationInvitationFailed = createAction(constants.ORGANIZATION_INVITATION_ADD_FAILED);


export const editOrganizationName = createAction(constants.ORGANIZATION_NAME_EDIT);
export const editOrganizationNameSuccess = createAction(constants.ORGANIZATION_NAME_EDIT_SUCCESS,
  organization => normalize(organization, schemas.organization),
);
export const editOrganizationNameFailed = createAction(constants.ORGANIZATION_NAME_EDIT_FAILED);


export const removeOrganizationMember = createAction(constants.ORGANIZATION_MEMBER_REMOVE);
export const removeOrganizationMemberSuccess = createAction(constants.ORGANIZATION_MEMBER_REMOVE_SUCCESS,
  organizationMember => normalize(organizationMember, schemas.organizationMember),
);
export const removeOrganizationMemberFailed = createAction(constants.ORGANIZATION_MEMBER_REMOVE_FAILED);
