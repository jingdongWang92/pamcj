import request from '@jcnetwork/util-better-request';


export function searchCartograms(query) {
  return request({
    method: 'get',
    endpoint: `/apis/cartograms`,
    query,
  });
}

export function removeCartogram(cartogram) {
  return request({
    method: 'delete',
    endpoint: `/apis/cartograms/${cartogram.id}`,
  });
}
