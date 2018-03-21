import request from '@jcnetwork/util-better-request';


export function searchUsers(query) {
  return request({
    method: 'get',
    endpoint: `/apis/users`,
    query,
  });
}

export function searchPlans(query) {
  return request({
    method: 'get',
    endpoint: `/apis/plans`,
    query,
  });
}


export function updateUser(user) {
  return request({
    method: 'put',
    endpoint: `/apis/users/${user.id}`,
    payload: user,
  });
}


export function sendRegisterEmail(user) {
  return request({
    method: 'post',
    endpoint: `/apis/users/${user.id}/register-email`,
  });
}


export function fetchUserSelf() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}


export function impersonateUser(user) {
  return request({
    method: 'post',
    endpoint: `/apis/users/${user.id}/impersonate`,
  });
}
