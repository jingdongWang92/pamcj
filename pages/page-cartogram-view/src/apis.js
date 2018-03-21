import request from '@jcnetwork/util-better-request';


export function fetchCartogram(cartogramId) {
  return request({
    method: 'get',
    endpoint: `/apis/cartograms/${cartogramId}`,
  });
}


export function updateCartogram(cartogram) {
  return request({
    method: 'put',
    endpoint: `/apis/cartograms/${cartogram.id}`,
    payload: cartogram,
  });
}


export function searchLocation(address) {
  return request({
    method: 'get',
    endpoint: `/apis/geocoding/geocoding`,
    query: {
      address: address,
    },
  });
}


export function searchOrganizations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
    query,
  });
}

export function searchInputTips(keywords) {
  return request({
    method: 'get',
    url: `/apis/geocoding/input-tips`,
    query: {
      keywords: keywords,
    }
  });
}
