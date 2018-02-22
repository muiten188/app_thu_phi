import * as types from "../../constants/action_types";
import * as AppConfig from "../../../config/app_config";
import { buildHeader, _logout } from "../../../helper";

export function getHistory(apartmentId, currentTime, user) {
  let apartmentIdParam = apartmentId || -1;
  let _currentTime = currentTime || "";
  return dispatch => {
    dispatch(_historying());

    fetch(
      `${AppConfig.API_HOST}tablet/?${getQueryString({
        apartmentId: apartmentIdParam,
        month: _currentTime
      })}`,
      {
        headers: buildHeader(user),
        method: "GET"
      }
    )
      .then(function(response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_historyError());
        } else {
          return response.json();
        }
      })
      .then(function(responseJson) {
        if (responseJson) {
          let historyList = responseJson.data;
          if (historyList) {
            dispatch(_history(historyList));
          } else {
            dispatch(_historyError());
          }
        }
      })
      .catch(function(error) {
        dispatch(_historyError());
      });
  };
}
function _historying() {
  return {
    type: types.HISTORYING,
    isLoading: true
  };
}
function _history(historyList) {
  return {
    type: types.HISTORY,
    listResult: historyList
  };
}

function _historyError() {
  return {
    type: types.HISTORY_ERROR
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
export function clearError() {
  return {
    type: types.HISTORY_CLEAR_ERROR,
  };
}