import request from '@jcnetwork/util-better-request';


export function createLayer(layer) {
  return request({
    method: 'post',
    endpoint: `/apis/layers`,
    payload: layer,
  });
}


export function searchOrganizations() {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
  });
}


export function fetchUserSelf() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}
