import { AsyncStorage } from "react-native";
import * as types from "../store/constants/action_types";
import RNXprinter from "react-native-xprinter";
import { Alert } from "react-native";
export function setAsyncStorage(key, value) {
  try {
    AsyncStorage.setItem(key, value);
  } catch (e) {
    alert("set error");
  }
}

export function getAsyncStorage(key, callback) {
  try {
    const hadUser = AsyncStorage.getItem(key)
      .then(callback)
      .done();
  } catch (error) {
    alert(error);
    // Error retrieving data
  }
}

export async function getUser() {
  try {
    const hadUser = await AsyncStorage.getItem("@user");
    return hadUser;
  } catch (error) {
    alert(error);
    // Error retrieving data
  }
}

export function clearAsyncStorage() {
  try {
    AsyncStorage.clear();
  } catch (e) {
    alert("clear error");
  }
}

export function buildHeader(user) {
  return {
    JSESSIONID: user.jSessionId
  };
}

function _fetchCatch() {
  return {
    type: types.BILL_DETAIL_FETCH_CATCH
  };
}

export function _logout() {
  return {
    type: types.AUTHEN_EXPRI
  };
}

export async function printBill(
  allPaymentItemList,
  paymentItemList,
  customerName,
  cashier,
  transactionCode,
  month,
  apartmentName
) {
  try {
    let nowDate = new Date();
    RNXprinter.initialize();
    await AsyncStorage.getItem("@ReactNativeXprinter:default_printer")
      .then(address => {
        if (address && address != "") {
          RNXprinter.selectDevice(address)
            .then(value => { })
            .catch(e => {
              Alert.alert(
                "Thông báo",
                "Vui lòng bật bluetooth và kết nối với máy In trước khi in."
              );
              return;
            });
        } else {
          RNXprinter.pickPrinter();
        }
      })
      .catch(() => {
        RNXprinter.pickPrinter();
      });

    AsyncStorage.getItem("@ReactNativeXprinter:default_printer")
      .then(address => {
        if (address && address != "") {
          customerName = change_alias(customerName).toUpperCase();
          cashier = change_alias(cashier).toUpperCase();

          RNXprinter.pushText("Cong Ty CP Cong Nghe Sao Bac Dau", 0, 1, 46);
          RNXprinter.pushText("Tang 15, Toa Lilama10, To Huu", 0, 1, 46);
          RNXprinter.pushText(
            "Trung Van, Q.Nam Tu Liem, Ha Noi\n",
            0,
            1,
            46
          );

          RNXprinter.pushText(`HOA DON THANG ${month}`, 0, 1, 45);
          RNXprinter.pushText(
            `Can ho: ${apartmentName}\n`,
            0,
            1,
            46
          );
          RNXprinter.pushText(
            _buildColBill("Khach hang:", customerName),
            0,
            1,
            46
          );

          RNXprinter.pushText(_buildColBill("NV Thu ngan:", cashier), 0, 1, 46);
          RNXprinter.pushText(
            _buildColBill("Hoa don so:", transactionCode),
            0,
            1,
            46
          );
          RNXprinter.pushText(
            _buildColBill("Thoi gian:", formatDate(nowDate) + "\n"),
            0,
            1,
            46
          );
          RNXprinter.pushText(
            _buildColBill("  Noi dung", "Thanh toan(VND)"),
            0,
            1,
            45
          );
          _buildPaymentList(RNXprinter, allPaymentItemList, paymentItemList),
            // RNXprinter.pushText(
            //   _buildPaymentList(allPaymentItemList, paymentItemList),
            //   0,
            //   1,
            //   46
            // );
            RNXprinter.pushText("", 0, 1, 46);
          // RNXprinter.pushText(_buildColBill("", "NV Thu ngan  "), 0, 1, 46);
          // RNXprinter.pushText("\n\n",0,1,46);
          // RNXprinter.pushText(_buildColBill("", "LUU QUYNH HUONG"), 0, 1, 46);
          RNXprinter.pushText("--------------------------------", 0, 1, 46);
          RNXprinter.pushText("Xin cam on!", 0, 1, 46);
          RNXprinter.pushCutPaper();
          RNXprinter.print()
            .then((value, mes) => { })
            .catch(e => {
              Alert.alert(
                "Thông báo",
                "In hóa đơn thất bại, kiểm tra lại kết nối máy in !"
              );
            });
        } else {
          Alert.alert(
            "Thông báo",
            "In hóa đơn thất bại, kiểm tra lại kết nối máy in !"
          );
        }
      })
      .catch(() => {
        Alert.alert(
          "Thông báo",
          "In hóa đơn thất bại, kiểm tra lại kết nối máy in !"
        );
      });
  } catch (e) {
    Alert.alert(
      "Thông báo",
      "In hóa đơn thất bại, kiểm tra lại kết nối máy in !"
    );
  }
}

function _buildColBill(title, value) {
  const totalChar = 32;
  const space = " ";
  const titleLength = title.length;
  const valueLength = value.length;
  let text = "";
  if (titleLength + valueLength < 32) {
    text = text + title;
    for (var i = 0; i < 32 - (titleLength + valueLength); i++) {
      text = text + space;
    }
    text = text + value;
  } else {
    text = text + title + "\n" + value;
  }
  return text;
}

function _buildPaymentList(RNXprinter, allPaymentItemList, paymentItemList) {
  let billPayment = "";
  let total = 0;
  let totalPay = 0;
  for (var i = 0; i < paymentItemList.length; i++) {
    let paymentItem = paymentItemList[i];
    if (paymentItem.invoiceDetailPaid > 0 || paymentItem.invoiceDetailAmount <= 0) {
      continue;
    }
    let text = "";
    let title = "";
    let value = "";
    switch (paymentItem.serviceName) {
      case "BUILDING_SERVICE":
        title = "DV Toa nha:";
        break;
      case "CAR":
        title = "Oto:";
        break;
      case "MOTORBIKE":
        title = "Xe may:";
        break;
      case "ELECTRIC":
        title = "Dien:";
        break;
      case "WATER":
        title = "Nuoc:";
        break;
      case "OTHERS":
        title = "DV Khac";
      default:
        title = "DV Khac";
        break;
    }
    value = paymentItem.invoiceDetailAmount.format() + " VND";
    total = total + paymentItem.invoiceDetailAmount;
    text = _buildColBill(title, value);
    billPayment = billPayment + text + "\n";
    totalPay = totalPay + paymentItem.invoiceDetailAmount;
  }
  billPayment = billPayment + "                 ---------------";
  RNXprinter.pushText(
    billPayment,
    0,
    1,
    46
  );
  RNXprinter.pushText(
    _buildColBill("Tong cong:", total.format() + " VND"),
    0,
    1,
    45
  );
  RNXprinter.pushText(
    _buildColBill("Da thanh toan:", totalPay.format() + " VND"),
    0,
    1,
    46
  );
}

function formatDate(date) {
  // var monthNames = [
  //   "January", "February", "March",
  //   "April", "May", "June", "July",
  //   "August", "September", "October",
  //   "November", "December"
  // ];
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();
  return hour + ":" + minutes + " - " + day + "/" + monthIndex + "/" + year;
}

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}
