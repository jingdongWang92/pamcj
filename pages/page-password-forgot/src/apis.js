import request from '@jcnetwork/util-better-request';


export function resetPassword(payload) {
  return request({
    method: 'put',
    endpoint: `/apis/users/self/password-forgot`,
    payload,
  });
}
