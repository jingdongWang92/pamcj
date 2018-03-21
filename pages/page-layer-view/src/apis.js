import request from '@jcnetwork/util-better-request';


export function fetchLayer(layerId) {
  return request({
    method: 'get',
    endpoint: `/apis/layers/${layerId}`,
  });
}


export function updateLayer(layer) {
  return request({
    method: 'put',
    endpoint: `/apis/layers/${layer.id}`,
    payload: layer,
  });
}
