import request from '@jcnetwork/util-better-request';


export function fetchUser(userId) {
  return request({
    method: 'get',
    url: `/apis/users/${userId}`,
  });
}


export function fetchCartogram(cartogramId) {
  return request({
    method: 'get',
    url: `/apis/cartograms/${cartogramId}`,
  });
}


export function searchLayers() {
  return request({
    method: 'get',
    url: `/apis/layers`,
  });
}


export function searchFeatures(query) {
  return request({
    method: 'get',
    url: `/apis/features`,
    query,
  });
}


export function createFeature(feature) {
  return request({
    method: 'post',
    url: `/apis/features`,
    data: feature,
  });
}


export function updateFeature(feature) {
  return request({
    method: 'put',
    url: `/apis/features/${feature.uuid}`,
    data: feature,
  });
}


export function removeFeature(feature) {
  return request({
    method: 'delete',
    url: `/apis/features/${feature.uuid}`,
  });
}


export function fetchCartogramGeoreference(cartogramId) {
  return request({
    method: 'get',
    url: `/apis/cartogram-georeferences/${cartogramId}`,
  });
}
