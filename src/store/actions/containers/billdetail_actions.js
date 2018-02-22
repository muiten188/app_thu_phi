import * as types from "../../constants/action_types";
import * as AppConfig from "../../../config/app_config";
import { buildHeader, _logout } from "../../../helper";
export function billPay(paymentItemList, bill, balance, user, callForm) {
  let dataPost = {};
  let _paymentItemList = [];
  let paymentItem = {};
  dataPost.accountBalance = balance;
  dataPost.apartmentId = bill.apartmentId;
  dataPost.invoiceId = bill.invoiceId;

  // for (var j = 0; j < bill.listInvoiceDetail.length; j++) {
  //   paymentItem = {};
  //   if (
  //     bill.listInvoiceDetail[j].invoiceDetailAmount <= 0 &&
  //     bill.listInvoiceDetail[j].invoiceDetailPaid <= 0
  //   ) {
  //     paymentItem.invoiceDetailId = bill.listInvoiceDetail[j].invoiceDetailId;
  //     paymentItem.paymentAmount = bill.listInvoiceDetail[j].arisingPeriod;
  //     paymentItem.paymentMethod = "BANK_TRANSFER";
  //     _paymentItemList.push(paymentItem);
  //   }
  // }
  for (var i = 0; i < paymentItemList.length; i++) {
    paymentItem = {};
    paymentItem.invoiceDetailId = paymentItemList[i].invoiceDetailId;
    // if (paymentItemList[i].invoiceDetailAmount <= 0) {
    //   paymentItem.paymentAmount = paymentItemList[i].arisingPeriod;
    // } else {
      paymentItem.paymentAmount = paymentItemList[i].invoiceDetailAmount;
    //}
    paymentItem.paymentMethod = paymentItemList[i].paymentMethod;
    paymentItem.listInvoiceDetailId = paymentItemList[i].listInvoiceDetailId;
    _paymentItemList.push(paymentItem);
  }
  dataPost.paymentItemList = _paymentItemList;
  return dispatch => {
    dispatch(_billPaying(callForm));
    fetch(`${AppConfig.API_HOST}tablet/payment`, {
      method: "POST",
      headers: Object.assign(
        {},
        {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        buildHeader(user)
      ),
      body: JSON.stringify(dataPost)
    })
      .then(function(response) {
        if (response.status == 401) {
          dispatch(_logout());
        }
        if (response.status != 200) {
          dispatch(_billPayError(callForm));
        } else {
          return response.json();
        }
      })
      .then(function(responseJson) {
        if (responseJson) {
          dispatch(_billPay(responseJson));
        } else {
          dispatch(_billPayError(callForm));
        }
      })
      .catch(function(error) {
        dispatch(_billPayError(callForm));
      });
  };
}

function _billPay(data) {
  return {
    type: types.BILL_PAY,
    transactionCode: data.transactionCode
  };
}

function _billPaying(callForm) {
  if(callForm == "LIST_INVOICE"){
    return {
      type: types.BILL_LISTING,
      isLoading: true
    };
  }
  else{
    return {
      type: types.BILL_PAYING
    };
  }
}

function _billPayError(callForm) {
  if (callForm == "LIST_INVOICE") {
    return {
      type: types.LIST_BILL_PAY_ERROR
    };
  } else {
    return {
      type: types.BILL_PAY_ERROR
    };
  }
}

export function clearError() {
  return {
    type: types.BILL_DETAIL_CLEAR_ERROR,
  };
}