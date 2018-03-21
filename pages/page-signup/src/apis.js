import request from '@jcnetwork/util-better-request';


export function registeUser(user) {
  return request({
    method: 'post',
    endpoint: `/apis/users`,
    payload: user,
  });
}
