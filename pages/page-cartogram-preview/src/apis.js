import request from '@jcnetwork/util-better-request';


export function searchCartograms(query) {
  return request({
    method: 'get',
    endpoint: `/apis/cartograms`,
    query,
  });
}

export function fetchCartogramGeojson(cartogramId) {
  return request({
    method: 'get',
    endpoint: `/apis/cartograms/${cartogramId}/geojson`,
  });
}
