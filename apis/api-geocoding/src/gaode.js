const axios = require('axios');


module.exports = config;


function config(key) {
  if (!key) {
    throw new Error('gaode key require');
  }


  return {
    geocoding: geocoding(key),
    reverseGeocoding: reverseGeocoding(key),
    inputTips: inputTips(key),
  };
}


function geocoding(key) {
  return async address => {
    const res = await axios({
      url: '/v3/geocode/geo',
      method: 'get',
      baseURL: 'http://restapi.amap.com',
      params: {
        key,
        address,
        output: 'json'
      },
    });


    if (res.data.status === '0' || res.data.count === 0) {
      throw new Error('无效地址');
    }


    if (!res.data.geocodes.length) {
      throw new Error('无效地址');
    }


    const [longitude, latitude] = res.data.geocodes[0].location.split(',');


    return {
      raw: res.data,
      location: {
        longitude,
        latitude,
      },
    };
  };
}


function reverseGeocoding(key) {
  return async (longitude, latitude) => {
    const res = await axios({
      url: '/v3/geocode/regeo',
      method: 'get',
      baseURL: 'http://restapi.amap.com',
      params: {
        key,
        location: [longitude, latitude].join(','),
        output: 'json'
      },
    });


    if (res.data.status === '0' || res.data.regeocode.formatted_address.length === 0) {
      throw new Error('无效座标');
    }


    const address = res.data.regeocode.formatted_address;


    return {
      raw: res.data,
      address,
    };
  };
}

function inputTips(key) {
  return async params => {
    const res = await axios({
      url: '/v3/assistant/inputtips',
      method: 'get',
      baseURL: 'http://restapi.amap.com',
      params: {
        datatype: 'poi',
        output: 'json',
        ...params,
        key,
      },
    });

    if (res.data.status === '0') {
      throw new Error(res.data.status);
    }

    return {
      raw: res.data,
    };
  };
}
