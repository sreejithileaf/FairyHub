/**
 * Created by Jebin for iLeaf Solutions Pvt.Ltd
 * on February 12, 2020
 * API main method General api to acces data from web
 */

import ApiConstants from './apiConstants';
import QueryString from 'query-string';

export default function api(path, params, method, storeCode, token) {
  console.log('API METHOD: ===', method);
  console.log('API PARAMS: ===', params);
  console.log('API TOKEN: ===', token);
  console.log('API STORE CODE: ===', storeCode);

  let apiUrl =
    storeCode && storeCode.length > 0
      ? ApiConstants.BASE_URL + '/rest/' + storeCode + '/V1' + path
      : ApiConstants.BASE_URL + '/rest/V1' + path;
  console.log('API URL', apiUrl);

  if (
    (method === 'GET' || method === 'get') &&
    params &&
    typeof params === 'object'
  ) {
    let query = QueryString.stringify(params, {
      skipNull: true,
    });

    apiUrl = apiUrl + '?' + query;
    console.log('API GET METHOD URL: ===', apiUrl);
  } else if (method === 'GET' || (method === 'get' && params)) {
    apiUrl = apiUrl + '/' + params;
    console.log('GET METHOD URL', apiUrl);
  }

  let options;
  options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // ...(token && {Authorization: token}),
      Authorization: 'Bearer ' + token,
      
    },
    method: method,
    ...(method !== 'get' && params && {body: JSON.stringify(params)}),
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl, options)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => resolve(jsonResponse))
      .catch(error => reject(error));
  });
}
