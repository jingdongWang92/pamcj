import request from '@jcnetwork/util-better-request';


export function searchOrganizations(query) {
  return request({
    method: 'get',
    endpoint: `/apis/organizations`,
    query,
  });
}


export function createCartogram(cartogram) {
  return request({
    method: 'post',
    url: `/apis/cartograms`,
    data: cartogram,
    timeout: 3000,
  });
}


export function uploadDiagram(diagramFile, onProgress) {
  const form = new FormData();
  form.append('diagram', diagramFile);
  return request({
    method: 'post',
    url: `/apis/cartograms/-/diagram`,
    data: form,
    onUploadProgress: evt => {
      const { loaded, total } = evt;
      onProgress(loaded / total);
    },
  });
}


export function searchLocation(address) {
  return request({
    method: 'get',
    url: `/apis/geocoding/geocoding`,
    query: {
      address: address,
    }
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
