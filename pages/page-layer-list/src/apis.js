import request from '@jcnetwork/util-better-request';


export function searchLayers(query) {
  return request({
    method: 'get',
    endpoint: `/apis/layers`,
    query,
  });
}

export function removeLayer(layer) {
  return request({
    method: 'delete',
    endpoint: `/apis/layers/${layer.id}`,
  });
}
