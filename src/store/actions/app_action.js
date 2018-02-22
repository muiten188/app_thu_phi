import * as types from "../constants/action_types";
import * as AppConfig from "../../config/app_config";
import { buildHeader, fetchCatch, _logout } from "../../helper";

export function _getUser(user) {
  return {
    type: types.USER_INFO,
    user: user
  };
}

export function closePayInfo() {
  return {
    type: types.CLOSE_PAYINFO
  };
}

export function showPayInfo() {
  return {
    type: types.SHOW_PAYINFO
  };
}

export function getPayInfo(startDate, endDate, user) {
  return dispatch => {
    dispatch(_getingPayInfo());
    fetch(
      `${AppConfig.API_HOST}tablet/sumaryPayment?${getQueryString({
        fromDate: startDate.toISOString(),
        toDate: endDate.toISOString()
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
          dispatch(_listPayError());
        } else {
          return response.json();
        }
      })
      .then(function (responseJson) {
        if (responseJson) {
          let bill = responseJson;
          if (bill) {
            dispatch(_listPayInfo(bill));
          } else {
            dispatch(_listPayError());
          }
        }
      })
      .catch(function (error) {
        dispatch(_listPayError());
      });
  }
}

export function clearPayListError() {
  return {
    type: types.LISTPAYINFO_CLEAR_ERROR,
  };
}

function _getingPayInfo() {
  return {
    type: types.LISTING_PAY_INFO
  };
}

function _listPayInfo(payInfo) {
  return {
    type: types.LIST_PAY_INFO,
    payInfo: payInfo,
  };
}

function _listPayError() {
  return {
    type: types.LIST_PAY_ERROR
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