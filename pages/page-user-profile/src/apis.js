import request from '@jcnetwork/util-better-request';


export function fetchProfile() {
  return request({
    method: 'get',
    endpoint: `/apis/users/self`,
  });
}

export function updateProfile(user) {
  return request({
    method: 'put',
    endpoint: `/apis/users/${user.id}`,
    payload: user,
  });
}

export function searchOrders(query) {
  return request({
    method: 'get',
    endpoint: `/apis/orders`,
    query,
  });
}

export function searchInvoices(query) {
  return request({
    method: 'get',
    endpoint: `/apis/invoices`,
    query,
  });
}


export function createInvoice(invoice) {
  return request({
    method: 'post',
    endpoint: `/apis/invoices`,
    payload: invoice,
  });
}

export function resetPassword(payload) {
  return request({
    method: 'put',
    endpoint: `/apis/users/self/password-reset`,
    payload,
  });
}
