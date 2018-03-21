import request from '@jcnetwork/util-better-request';


export function fetchUserSelf() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}


export function markUserEmailVerified(user) {
  return request({
    method: 'put',
    endpoint: `/apis/users/${user.id}/email-mark-verified`,
  });
}
