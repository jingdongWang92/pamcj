export function fetchCartogramCollection(cartogramCollectionId) {
  return {
    method: 'get',
    endpoint: `/apis/cartogram-collections/${cartogramCollectionId}`,
  };
}


export function updateCartogramCollection(cartogramCollection) {
  return {
    method: 'put',
    endpoint: `/apis/cartogram-collections/${cartogramCollection.id}`,
    payload: cartogramCollection,
  };
}


export function searchCartograms(query) {
  return {
    method: 'get',
    endpoint: `/apis/cartograms`,
    query,
  };
}
