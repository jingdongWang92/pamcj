import request from '@jcnetwork/util-better-request';

export function createCartogramCollection(cartogramCollection) {
  return request({
    method: 'post',
    endpoint: `/apis/cartogram-collections`,
    payload: cartogramCollection,
  });
}

export function searchCartograms(query) {
  return request({
    method: 'get',
    endpoint: `/apis/cartograms`,
    query,
  });
}

export function searchOrganizations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
    query,
  });
}
