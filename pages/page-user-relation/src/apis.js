import request from '@jcnetwork/util-better-request';

export function bindAccount(payload) {
  return request({
    method: 'post',
    url: `/apis/authorization/zhubajie`,
    data: payload,
  });
}
