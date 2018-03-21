import request from '@jcnetwork/util-better-request';


export function searchCartogramCollections(query) {
  return request({
    method: 'get',
    endpoint: `/apis/cartogram-collections`,
    query,
  });
}

export function removeCartogramCollection(cartogramCollection) {
  return request({
    method: 'delete',
    endpoint: `/apis/cartogram-collections/${cartogramCollection.id}`,
  });
}
