import request from '@jcnetwork/util-better-request';
import querystring from 'querystring';


export function fetchCartogramCollection(cartogramCollectionId) {
  return request({
    method: 'get',
    url: `/apis/cartogram-collections/${cartogramCollectionId}`,
  });
}


export function searchFeatures(query) {
  const _query = {
    ...query,
    layer_code: ['stair', 'lift'],
  };

  return request({
    method: 'get',
    url: `/apis/features?${querystring.stringify(_query)}`,
  });
}


export function searchCartogramRoutes(query) {
  return request({
    method: 'get',
    url: `/apis/cartogram-routes`,
    query,
  });
}


export function createCartogramRoute(cartogramRoute) {
  return request({
    method: 'post',
    url: `/apis/cartogram-routes`,
    data: cartogramRoute,
  });
}


export function updateCartogramRoute(cartogramRoute) {
  return request({
    method: 'put',
    url: `/apis/cartogram-routes/${cartogramRoute.id}`,
    data: cartogramRoute,
  });
}


export function removeCartogramRoute(cartogramRoute) {
  return request({
    method: 'delete',
    url: `/apis/cartogram-routes/${cartogramRoute.id}`,
  });
}
