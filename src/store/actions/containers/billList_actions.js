import * as types from "../../constants/action_types";
import * as AppConfig from "../../../config/app_config";
import { buildHeader, _logout } from "../../../helper";

function getBalance(apartmentId, dispatch, user) {
  let apartmentIdParam = apartmentId || -1;
  fetch(
    `${
    AppConfig.API_HOST
    }tablet/apartment/${apartmentIdParam}/account-balance/`,
    {
      headers: buildHeader(user),
      method: "GET"
    }
  )
    .then(function (response) {
      if (response.status == 401) {
        dispatch(_logout());
      }
      if (response.status != 200) {
        dispatch(_billError());
      } else {
        return response.json();
      }
    })
    .then(function (responseJson) {
      if (responseJson) {
        let balance = responseJson.accountBalance;
        let totalDebit = responseJson.totalDebit;
        if (balance !== undefined && totalDebit !== undefined) {
          dispatch(_balance(balance, totalDebit));
        } else {
          dispatch(_billError());
        }
      }
    })
    .catch(function (error) {
      dispatch(_billError());
    });
}

export function getBillList(apartmentId, currentPage, pageSize, user) {
  let apartmentIdParam = apartmentId || -1;
  return dispatch => {
    // dispatch(_billListing());
    getBalance(apartmentIdParam, dispatch, user);
    fetch(
      `${AppConfig.API_HOST}tablet/invoice/?${getQueryString({
        aparmentId: apartmentIdParam,
        currentPage: 1,
        pageSize: pageSize
      })}`,
      {
        headers: buildHeader(user),
        method: "GET"
      }
    )
      .then(function (response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_billError());
        } else {
          return response.json();
        }
      })
      .then(function (responseJson) {
        if (responseJson) {
          let billList = responseJson.data;
          if (billList) {
            dispatch(_billList(billList));
          } else {
            dispatch(_billError());
          }
        }
      })
      .catch(function (error) {
        dispatch(_billError());
      });
  };
}

export function refreshBillList(apartmentId, currentPage, pageSize, user) {
  let apartmentIdParam = apartmentId || -1;
  return dispatch => {
    dispatch(_billListing());
    getBalance(apartmentIdParam, dispatch, user);
    fetch(
      `${AppConfig.API_HOST}tablet/invoice/?${getQueryString({
        aparmentId: apartmentIdParam,
        currentPage: 1,
        pageSize: pageSize
      })}`,
      {
        headers: buildHeader(user),
        method: "GET"
      }
    )
      .then(function (response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_billError());
        } else {
          return response.json();
        }
      })
      .then(function (responseJson) {
        if (responseJson) {
          let billList = responseJson.data;
          if (billList) {
            dispatch(_billList(billList));
          } else {
            dispatch(_billError());
          }
        }
      })
      .catch(function (error) {
        dispatch(_billError());
      });
  };
}

function _balance(balance, totalDebit) {
  return {
    type: types.BALANCE,
    balance: balance,
    totalDebit: totalDebit
  };
}

function _billList(billList) {
  return {
    type: types.BILL_LIST,
    listResult: billList
  };
}

function _billListing() {
  return {
    type: types.BILL_LISTING,
    isLoading: true
  };
}

function _billError() {
  return {
    type: types.LIST_ERROR
  };
}

function getQueryString(params) {
  return Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
          .join("&");
      }

      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join("&");
}

export function reset() {
  return {
    type: types.LIST_RESET
  };
}

export function getBillFromId(aparmentId, invoiceId, user) {
  return dispatch => {
    dispatch(_billListing());
    fetch(
      `${AppConfig.API_HOST}tablet/invoice/loadById?${getQueryString({
        invoiceId: invoiceId
      })}`,
      {
        headers: buildHeader(user),
        method: "GET"
      }
    )
      .then(function (response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_billError());
        } else {
          return response.json();
        }
      })
      .then(function (responseJson) {
        if (responseJson) {
          let bill = responseJson;
          if (bill) {
            dispatch(_bill(bill));
          } else {
            dispatch(_billError());
          }
        }
      })
      .catch(function (error) {
        dispatch(_billError());
      });
  };
}

export function loadMore(apartmentId, currentPage, pageSize, user) {
  let apartmentIdParam = apartmentId || -1;
  return dispatch => {
    // dispatch(_billListing());
    fetch(
      `${AppConfig.API_HOST}tablet/invoice/?${getQueryString({
        aparmentId: apartmentIdParam,
        currentPage: currentPage + 1,
        pageSize: pageSize
      })}`,
      {
        headers: buildHeader(user),
        method: "GET"
      }
    )
      .then(function (response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_billError());
        } else {
          return response.json();
        }
      })
      .then(function (responseJson) {
        if (responseJson) {
          let billList = responseJson.data;
          if (billList) {
            dispatch(_dataMore(billList));
          } else {
            dispatch(_billError());
          }
        }
      })
      .catch(function (error) {
        dispatch(_billError());
      });
  };
}
function _dataMore(listResult) {
  return {
    type: types.BILL_LIST_LOADMORE,
    listResult: listResult
  };
}

function _bill(bill) {
  return {
    type: types.BILL_FROM_ID,
    bill: bill
  };
}

export function clearError() {
  return {
    type: types.BILL_LIST_CLEAR_ERROR,
  };
}