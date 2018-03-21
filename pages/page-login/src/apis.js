import request from '@jcnetwork/util-better-request';


export function fetchToken(payload) {
  return request({
    method: 'post',
    endpoint: `/apis/token`,
    payload,
  });
}
