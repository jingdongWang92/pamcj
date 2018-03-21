import request from '@jcnetwork/util-better-request';


export function fetchUserSelf() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}


export function searchOrganizations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
    query,
  });
}


export function createOrganization(organization) {
  return request({
    method: 'post',
    endpoint: `/apis/organizations`,
    payload: organization,
  });
}


export function updateOrganization(organization) {
  return request({
    method: 'put',
    endpoint: `/apis/organizations/${organization.id}`,
    payload: organization,
  });
}


export function removeOrganization(organization) {
  return request({
    method: 'delete',
    endpoint: `/apis/organizations/${organization.id}`,
  });
}


export function searchOrganizationInvitations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organization-invitations`,
    query,
  });
}


export function createOrganizationInvitation(organizationInvitation) {
  return request({
    method: 'post',
    endpoint: `/apis/organizations/${organizationInvitation.organization_id}/invitations`,
    payload: organizationInvitation,
  });
}


export function acceptOrganizationInvitation(organizationInvitation) {
  return request({
    method: 'post',
    endpoint: `/apis/organization-invitations/${organizationInvitation.id}/accept`,
  });
}


export function rejectOrganizationInvitation(organizationInvitation) {
  return request({
    method: 'post',
    endpoint: `/apis/organization-invitations/${organizationInvitation.id}/reject`,
  });
}


export function searchOrganizationMembers(organization) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations/${organization.id}/members`,
  });
}


export function removeOrganizationMember(organizationMember) {
  return request({
    method: 'delete',
    endpoint: `/apis/organization-members/${organizationMember.id}`,
  });
}
