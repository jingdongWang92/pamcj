import request from '@jcnetwork/util-better-request';


export function fetchToken(payload) {
  return request({
    method: 'put',
    endpoint: `/apis/users/logout`,
    payload,
  });
}
