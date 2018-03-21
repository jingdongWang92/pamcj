import request from '@jcnetwork/util-better-request';


export function fetchCartogramGeoreference(cartogramId) {
  return request({
    method: 'get',
    endpoint: `/apis/cartogram-georeferences/${cartogramId}`,
  });
}


export function updateCartogramGeoreference(cartogramGeoreference) {
  return request({
    method: 'put',
    endpoint: `/apis/cartogram-georeferences/${cartogramGeoreference.cartogram_id}`,
    payload: cartogramGeoreference,
  });
}
