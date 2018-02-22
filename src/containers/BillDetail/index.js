import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard
} from "react-native";
import {
  Container,
  Text,
  Button,
  Content,
  Body,
  Thumbnail,
  Form,
  Item,
  Input,
  H1,
  H2,
  H3,
  Label,
  CheckBox
} from "native-base";
import styles from "./styles";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Grid, Col, Row } from "react-native-easy-grid";
import I18n from "../../i18n/i18n";
import { InputField } from "../../components/InputField";
import Icon from "react-native-vector-icons/FontAwesome";
import { Field, reduxForm } from "redux-form";
import { DateField } from "../../components/Element/Form";
import * as navigationAction from "../../store/actions/root_navigation/root_navigation_actions";
import ConfirmModal from "../../components/ConfirmModal";
import PayModal from "../../components/PayModal";
import * as billDetailAction from "../../store/actions/containers/billdetail_actions";
import * as billListAction from "../../store/actions/containers/billList_actions";
import Loading from "../../components/Loading";
import { printBill } from "../../helper";
import { TextInputMask } from "react-native-masked-text";

class billDetail extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    const { bill, balance, totalDebit } = this.props.navigation.state.params;
    let tempState = {};
    let checkboxArr = [];
    for (var i = 0; i < bill.listInvoiceDetail.length; i++) {
      if (bill.listInvoiceDetail[i].invoiceDetailPaid == null) {
        bill.listInvoiceDetail[i].invoiceDetailPaid = 0;
      }
      bill.listInvoiceDetail[i].invoiceDetailAmount =
        bill.listInvoiceDetail[i].invoiceDetailAmount -
        bill.listInvoiceDetail[i].invoiceDetailPaid;
      if (bill.listInvoiceDetail[i].invoiceDetailAmount < 0) {
        bill.listInvoiceDetail[i].invoiceDetailAmount = 0;
      }
      tempState["cashPay" + bill.listInvoiceDetail[i].invoiceDetailId] = false;
      checkboxArr.push("cashPay" + bill.listInvoiceDetail[i].invoiceDetailId);
      tempState[
        "creditPay" + bill.listInvoiceDetail[i].invoiceDetailId
      ] = false;
      checkboxArr.push("creditPay" + bill.listInvoiceDetail[i].invoiceDetailId);
    }
    this.state = {
      ...tempState,
      checkboxArr: checkboxArr,
      creditAll: false,
      cashAll: false,
      totalPay: 0,
      totalCashPay: 0,
      totalCreditPay: 0,
      payBalance: 0,
      paymentItemList: [],
      totalCustomerPay: 0,
      totalReturn: 0,
      keyBoardShow: false
    };
    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
    Number.prototype.format = function(n, x) {
      var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
      return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
    };
  }

  componentDidMount() {
    // setTimeout(() => this.checkAll("CASH"), 0);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({ keyBoardShow: true });
  }

  _keyboardDidHide() {
    this.setState({ keyBoardShow: false });
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  payChange(value) {
    const { state } = this;
    let _value = this.refs["InputPay"].getRawValue();
    if (this.isNumeric(_value)) {
      this.setState({
        totalCustomerPay: _value,
        totalReturn: _value - state.totalPay
      });
    }
  }

  buildRowBillDetail(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty
    } = this.state;
    if (item.serviceName.indexOf("BUILDING") > -1) {
      return (
        <Item style={styles.borderBottomNone}>
          <Icon
            name="building"
            style={[styles.icon, buildingEmpty ? styles.label_row_empty : {}]}
          />
          <Label
            style={[styles.text, buildingEmpty ? styles.label_row_empty : {}]}
          >
            {I18n.t("buildingCost", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    } else if (item.serviceName.indexOf("ELECTRIC") > -1) {
      return (
        <Item style={styles.borderBottomNone}>
          <Icon
            name="plug"
            style={[styles.icon, electricEmpty ? styles.label_row_empty : {}]}
          />
          <Label
            style={[styles.text, electricEmpty ? styles.label_row_empty : {}]}
          >
            {I18n.t("electricCost", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    } else if (item.serviceName.indexOf("WATER") > -1) {
      return (
        <Item style={styles.borderBottomNone}>
          <Icon
            name="tint"
            style={[styles.icon, waterEmpty ? styles.label_row_empty : {}]}
          />
          <Label
            style={[styles.text, waterEmpty ? styles.label_row_empty : {}]}
          >
            {I18n.t("waterCost", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    } else if (item.serviceName.indexOf("MOTORBIKE") > -1) {
      return (
        <Item style={styles.borderBottomNone}>
          <Icon
            name="motorcycle"
            style={[styles.icon, bikeEmpty ? styles.label_row_empty : {}]}
          />
          <Label style={[styles.text, bikeEmpty ? styles.label_row_empty : {}]}>
            {I18n.t("bikeCost", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    } else if (item.serviceName.indexOf("CAR") > -1) {
      return (
        <Item style={styles.borderBottomNone}>
          <Icon
            name="car"
            style={[styles.icon, carEmpty ? styles.label_row_empty : {}]}
          />
          <Label style={[styles.text, carEmpty ? styles.label_row_empty : {}]}>
            {I18n.t("carCost", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    } else {
      return (
        <Item style={styles.itemBorderNone}>
          <Label style={styles.text}>
            {I18n.t("serviceOther", {
              locale: locale ? locale : "vn"
            })}
          </Label>
        </Item>
      );
    }
  }

  buildRowBillDetailStartPeriod(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty
    } = this.state;
    item.earlyPeriod = item.earlyPeriod ? item.earlyPeriod : 0;
    if (item.serviceName.indexOf("BUILDING") > -1) {
      return (
        <Text
          style={[styles.text, buildingEmpty ? styles.label_row_empty : {}]}
        >
          {item.earlyPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("ELECTRIC") > -1) {
      return (
        <Text
          style={[styles.text, electricEmpty ? styles.label_row_empty : {}]}
        >
          {item.earlyPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("WATER") > -1) {
      return (
        <Text style={[styles.text, waterEmpty ? styles.label_row_empty : {}]}>
          {item.earlyPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("MOTORBIKE") > -1) {
      return (
        <Text style={[styles.text, bikeEmpty ? styles.label_row_empty : {}]}>
          {item.earlyPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("CAR") > -1) {
      return (
        <Text style={[styles.text, carEmpty ? styles.label_row_empty : {}]}>
          {item.earlyPeriod.format() + " VNĐ"}
        </Text>
      );
    } else {
      return (
        <Text style={styles.text}>{item.earlyPeriod.format() + " VNĐ"}</Text>
      );
    }
  }

  buildRowBillDetailInPeriod(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty
    } = this.state;
    item.arisingPeriod = item.arisingPeriod ? item.arisingPeriod : 0;
    if (item.serviceName.indexOf("BUILDING") > -1) {
      return (
        <Text
          style={[styles.text, buildingEmpty ? styles.label_row_empty : {}]}
        >
          {item.arisingPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("ELECTRIC") > -1) {
      return (
        <Text
          style={[styles.text, electricEmpty ? styles.label_row_empty : {}]}
        >
          {item.arisingPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("WATER") > -1) {
      return (
        <Text style={[styles.text, waterEmpty ? styles.label_row_empty : {}]}>
          {item.arisingPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("MOTORBIKE") > -1) {
      return (
        <Text style={[styles.text, bikeEmpty ? styles.label_row_empty : {}]}>
          {item.arisingPeriod.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("CAR") > -1) {
      return (
        <Text style={[styles.text, carEmpty ? styles.label_row_empty : {}]}>
          {item.arisingPeriod.format() + " VNĐ"}
        </Text>
      );
    } else {
      return (
        <Text style={styles.text}>{item.arisingPeriod.format() + " VNĐ"}</Text>
      );
    }
  }

  buildRowBillDetailTotal(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty
    } = this.state;
    if (item.serviceName.indexOf("BUILDING") > -1) {
      return (
        <Text
          style={[styles.text, buildingEmpty ? styles.label_row_empty : {}]}
        >
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("ELECTRIC") > -1) {
      return (
        <Text
          style={[styles.text, electricEmpty ? styles.label_row_empty : {}]}
        >
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("WATER") > -1) {
      return (
        <Text style={[styles.text, waterEmpty ? styles.label_row_empty : {}]}>
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("MOTORBIKE") > -1) {
      return (
        <Text style={[styles.text, bikeEmpty ? styles.label_row_empty : {}]}>
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("CAR") > -1) {
      return (
        <Text style={[styles.text, carEmpty ? styles.label_row_empty : {}]}>
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    } else {
      return (
        <Text style={styles.text}>
          {item.invoiceDetailAmount.format() + " VNĐ"}
        </Text>
      );
    }
  }
  buildRowBillDetailPaid(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty
    } = this.state;
    if (item.invoiceDetailPaid == null) {
      item.invoiceDetailPaid = 0;
    }
    if (item.serviceName.indexOf("BUILDING") > -1) {
      return (
        <Text
          style={[
            styles.text,
            buildingEmpty ? styles.label_row_empty : {},
            styles.primary
          ]}
        >
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("ELECTRIC") > -1) {
      return (
        <Text
          style={[
            styles.text,
            electricEmpty ? styles.label_row_empty : {},
            styles.primary
          ]}
        >
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("WATER") > -1) {
      return (
        <Text
          style={[
            styles.text,
            waterEmpty ? styles.label_row_empty : {},
            styles.primary
          ]}
        >
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("MOTORBIKE") > -1) {
      return (
        <Text
          style={[
            styles.text,
            bikeEmpty ? styles.label_row_empty : {},
            styles.primary
          ]}
        >
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    } else if (item.serviceName.indexOf("CAR") > -1) {
      return (
        <Text
          style={[
            styles.text,
            carEmpty ? styles.label_row_empty : {},
            styles.primary
          ]}
        >
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    } else {
      return (
        <Text style={styles.text}>
          {item.invoiceDetailPaid.format() + " VNĐ"}
        </Text>
      );
    }
  }
  buildRowBillDetailCash(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty,
      otherEmpty
    } = this.state;
    const { state } = this;
    const { bill, balance, totalDebit } = this.props.navigation.state.params;
    return (
      <CheckBox
        style={styles.checkBox}
        disabled={item.invoiceDetailAmount <= 0}
        color={item.invoiceDetailAmount <= 0 ? "#cecece" : "#054f9a"}
        checked={state["cashPay" + item.invoiceDetailId]}
        onPress={() => {
          item.paymentMethod = "CASH";
          item.listInvoiceDetailId = item.listInvoiceDetailId;
          let temp = {};
          let temp2 = {};
          temp["cashPay" + item.invoiceDetailId];
          state["cashPay" + item.invoiceDetailId] == true
            ? (temp["cashPay" + item.invoiceDetailId] = false)
            : (temp["cashPay" + item.invoiceDetailId] = true),
            (temp2["creditPay" + item.invoiceDetailId] = false);
          state["cashPay" + item.invoiceDetailId] == true
            ? this.setState({
                ...temp,
                creditAll: false,
                cashAll: false,
                totalPay: state.totalPay - item.invoiceDetailAmount,
                totalCashPay: state.totalCashPay - item.invoiceDetailAmount,
                paymentItemList: state.paymentItemList.filter((i, index) => {
                  return i.invoiceDetailId != item.invoiceDetailId;
                })
              })
            : this.setState({
                ...temp,
                ...temp2,
                creditAll: false,
                cashAll: false,
                totalPay:
                  state["creditPay" + item.invoiceDetailId] != true
                    ? state.totalPay + item.invoiceDetailAmount
                    : state.totalPay,
                totalCashPay: state.totalCashPay + item.invoiceDetailAmount,
                totalCreditPay:
                  state["creditPay" + item.invoiceDetailId] != true
                    ? state.totalCreditPay
                    : state.totalCreditPay - item.invoiceDetailAmount,
                paymentItemList:
                  state.paymentItemList.indexOf(item) == -1
                    ? [...state.paymentItemList, item]
                    : state.paymentItemList
              });
        }}
      />
    );
  }
  buildRowBillDetailCredit(item, locale) {
    const {
      buildingEmpty,
      electricEmpty,
      waterEmpty,
      bikeEmpty,
      carEmpty,
      otherEmpty
    } = this.state;
    const { state } = this;
    const { bill, balance, totalDebit } = this.props.navigation.state.params;
    return (
      <CheckBox
        style={styles.checkBox}
        disabled={item.invoiceDetailAmount <= 0}
        color={item.invoiceDetailAmount <= 0 ? "#cecece" : "#054f9a"}
        checked={state["creditPay" + item.invoiceDetailId]}
        onPress={() => {
          item.paymentMethod = "POS";
          item.listInvoiceDetailId = item.listInvoiceDetailId;
          let temp = {};
          let temp2 = {};
          temp["creditPay" + item.invoiceDetailId];
          state["creditPay" + item.invoiceDetailId] == true
            ? (temp["creditPay" + item.invoiceDetailId] = false)
            : (temp["creditPay" + item.invoiceDetailId] = true),
            (temp2["cashPay" + item.invoiceDetailId] = false);
          state["creditPay" + item.invoiceDetailId] == true
            ? this.setState({
                ...temp,
                creditAll: false,
                cashAll: false,
                totalPay: state.totalPay - item.invoiceDetailAmount,
                totalCreditPay: state.totalCreditPay - item.invoiceDetailAmount,
                paymentItemList: state.paymentItemList.filter((i, index) => {
                  return i.invoiceDetailId != item.invoiceDetailId;
                })
              })
            : this.setState({
                ...temp,
                ...temp2,
                creditAll: false,
                cashAll: false,
                totalPay:
                  state["cashPay" + item.invoiceDetailId] != true
                    ? state.totalPay + item.invoiceDetailAmount
                    : state.totalPay,
                totalCreditPay: state.totalCreditPay + item.invoiceDetailAmount,
                totalCashPay:
                  state["cashPay" + item.invoiceDetailId] != true
                    ? state.totalCashPay
                    : state.totalCashPay - item.invoiceDetailAmount,
                paymentItemList:
                  state.paymentItemList.indexOf(item) == -1
                    ? [...state.paymentItemList, item]
                    : state.paymentItemList
              });
        }}
      />
    );
  }
  checkAll(payMedthod) {
    const state = this.state;
    const { bill, balance, totalDebit } = this.props.navigation.state.params;
    let paymentItemList = [];
    let totalPay = 0;
    let totalCreditPay = 0;
    let totalCashPay = 0;
    checkedObj = {};
    checkObj = {};
    for (var i = 0; i < bill.listInvoiceDetail.length; i++) {
      bill.listInvoiceDetail[i].paymentMethod = payMedthod;
      if (payMedthod == "CASH") {
        if (state.cashAll == false) {
          if (bill.listInvoiceDetail[i].invoiceDetailPaid <= 0) {
            paymentItemList.push(bill.listInvoiceDetail[i]);
          }
          totalCreditPay = 0;
          totalPay = totalPay + bill.listInvoiceDetail[i].invoiceDetailAmount;
          totalCashPay =
            totalCashPay + bill.listInvoiceDetail[i].invoiceDetailAmount;
          for (var j = 0; j < state.checkboxArr.length; j++) {
            if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("cash") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = true;
            } else if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("credit") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = false;
            }
          }
        } else {
          for (var j = 0; j < state.checkboxArr.length; j++) {
            if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("cash") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = false;
            }
          }
        }
        checkObj = {
          creditAll: false,
          cashAll: state.cashAll ? false : true
        };
      } else if (payMedthod == "POS") {
        if (state.creditAll == false) {
          if (bill.listInvoiceDetail[i].invoiceDetailPaid <= 0) {
            paymentItemList.push(bill.listInvoiceDetail[i]);
          }
          totalCashPay = 0;
          totalPay = totalPay + bill.listInvoiceDetail[i].invoiceDetailAmount;
          totalCreditPay =
            totalCreditPay + bill.listInvoiceDetail[i].invoiceDetailAmount;
          for (var j = 0; j < state.checkboxArr.length; j++) {
            if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("credit") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = true;
            } else if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("cash") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = false;
            }
          }
        } else {
          for (var j = 0; j < state.checkboxArr.length; j++) {
            if (
              state.checkboxArr[j] &&
              state.checkboxArr[j].indexOf("credit") >= 0
            ) {
              checkedObj[state.checkboxArr[j]] = false;
            }
          }
        }
        checkObj = {
          creditAll: state.creditAll ? false : true,
          cashAll: false
        };
      }
    }
    this.setState({
      ...checkObj,
      ...checkedObj,
      paymentItemList: paymentItemList,
      totalCashPay: totalCashPay,
      totalCreditPay: totalCreditPay,
      totalPay: totalPay
    });
  }
  render() {
    const locale = "vn";
    const { dispatch } = this.props.navigation;
    const {
      bill,
      balance,
      totalDebit,
      apartment
    } = this.props.navigation.state.params;
    const { billDetailAction } = this.props;
    const {
      transactionCode,
      billPayError,
      isLoading
    } = this.props.billDetailReducer;
    const { currentPage, pageSize } = this.props.billListReducer;
    const { billListAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    const state = this.state;
    let rentEmpty = false;
    let remainUseEmpty = false;
    if (!state.rentCashPay && !state.rentCreditPay) {
      rentEmpty = true;
    }
    if (billPayError == true) {
      Alert.alert(
        "Thông Báo",
        "Thanh toán hóa đơn lỗi kiểm tra lại đường truyền.",
        [
          {
            text: "Ok",
            onPress: e => {
              billDetailAction.clearError();
            }
          }
        ],
        { cancelable: false }
      );
    }

    return (
      <Container style={styles.container}>
        <Header
          headerTitle={
            I18n.t("billDetail", {
              locale: locale ? locale : "vn"
            }) + bill.invoiceMonth
          }
          showButtonLeft={true}
          onBack={() => dispatch.pop()}
          // showSearch={true}
          // onSearch={this.onSearchClick.bind(this)}
          showUser={true}
        />
        <View style={styles.container_info_outer}>
          <Loading isShow={isLoading} />
          <Grid style={{ paddingTop: 2 }}>
            <Col>
              <Row style={styles.row_Header}>
                <Col style={styles.titleCol}>
                  <H3 style={[{ paddingLeft: 16 }, styles.textPadding]}>
                    {I18n.t("billCostTitle", {
                      locale: locale ? locale : "vn"
                    })}{" "}
                    {bill.invoiceMonth}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("balancePeriod", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("incresePeriod", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("totalMoney", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("payed", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("totalCash", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
                <Col style={styles.col}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("totalCredit", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Col>
              </Row>
              <Content>
                <Row style={[styles.billDetailRow]}>
                  <Col style={styles.titleDetailCol} />
                  <Col style={styles.col_detail} />
                  <Col style={styles.col_detail} />
                  <Col style={styles.col_detail} />
                  <Col style={styles.col_detail} />
                  <Col style={styles.col_detail}>
                    <CheckBox
                      style={[
                        styles.checkBox,
                        { marginTop: 6, marginBottom: 6 }
                      ]}
                      disabled={bill.listInvoiceDetail <= 0}
                      color={
                        bill.listInvoiceDetail <= 0 ? "#cecece" : "#054f9a"
                      }
                      checked={state.cashAll}
                      onPress={this.checkAll.bind(this, "CASH")}
                    />
                  </Col>
                  <Col style={styles.col_detail}>
                    <CheckBox
                      style={styles.checkBox}
                      disabled={bill.listInvoiceDetail <= 0}
                      color={
                        bill.listInvoiceDetail <= 0 ? "#cecece" : "#054f9a"
                      }
                      checked={state.creditAll}
                      onPress={this.checkAll.bind(this, "POS")}
                    />
                  </Col>
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col style={styles.titleDetailCol}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetail(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailStartPeriod(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailInPeriod(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailTotal(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailPaid(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailCash(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                  <Col style={styles.col_detail}>
                    {bill.listInvoiceDetail.map((item, index) => {
                      return (
                        <Row key={index} style={styles.rowDetail_inner}>
                          {this.buildRowBillDetailCredit(item, locale)}
                        </Row>
                      );
                    })}
                  </Col>
                </Row>
              </Content>
            </Col>
            <Col style={styles.totalCol}>
              <Row style={styles.row_Header}>
                <H3 style={styles.textPadding}>
                  {I18n.t("TotalPay", {
                    locale: locale ? locale : "vn"
                  })}
                </H3>
              </Row>
              <Row style={[styles.border, styles.center]}>
                <View style={[{ flex: 1 }, styles.center]}>
                  <Item
                    style={[
                      styles.center,
                      styles.borderBottomNone,
                      { width: "100%" }
                    ]}
                    onPress={() => this.payChange()}
                  >
                    <H1
                      style={[
                        styles.pay_item,
                        styles.totalPay,
                        styles.textPadding
                      ]}
                    >
                      {state.totalPay <= 0
                        ? "0 VNĐ"
                        : state.totalPay.format() + " VNĐ"}
                    </H1>
                  </Item>

                  {!state.keyBoardShow ? (
                    <View>
                      <Text style={styles.pay_item}>
                        {I18n.t("inOf", {
                          locale: locale ? locale : "vn"
                        })}
                      </Text>
                      <Item style={[styles.pay_item, styles.borderBottomNone]}>
                        <Icon name="money" style={styles.icon} />
                        <Text>
                          {state.totalCashPay.format() + " VNĐ"}{" "}
                          {state.payBalance > 0
                            ? " - " + state.payBalance.format() + " VNĐ"
                            : ""}
                        </Text>
                      </Item>
                      <Item style={[styles.pay_item, styles.borderBottomNone]}>
                        <Icon name="credit-card-alt" style={styles.icon} />
                        <Text>{state.totalCreditPay.format() + " VNĐ"}</Text>
                      </Item>
                      <Button
                        full
                        disabled={
                          state.paymentItemList &&
                          state.paymentItemList.length <= 0
                        }
                        style={
                          state.paymentItemList &&
                          state.paymentItemList.length <= 0
                            ? styles.buttomPay_disabled
                            : styles.buttomPay
                        }
                        onPress={() => {
                          this.setState({ isModalConfirm: true });
                        }}
                      >
                        <Text uppercase={false}>
                          {I18n.t("pay", {
                            locale: locale ? locale : "vn"
                          })}
                        </Text>
                      </Button>
                    </View>
                  ) : null}

                  <Text style={styles.customer_pay_item}>
                    {I18n.t("customerPay", {
                      locale: locale ? locale : "vn"
                    })}
                  </Text>
                  <Item style={{}} inlineLabel>
                    <TextInputMask
                      ref={"InputPay"}
                      style={{ width: "100%", fontSize: 20 }}
                      placeholder="Số tiền thanh toán"
                      value={state.totalCustomerPay}
                      onChangeText={value => this.payChange(value)}
                      customTextInput={Input}
                      type={"money"}
                      options={{
                        unit: "",
                        suffixUnit: "VNĐ",
                        precision: 0,
                        separator: " ",
                        zeroCents: true
                      }}
                    />
                    {state.keyBoardShow ? (
                      <Button
                        transparent
                        style={{ width: 10 }}
                        onPress={() => {
                          this.setState({
                            totalCustomerPay: 0,
                            totalReturn: 0
                          });
                        }}
                      >
                        <Icon name="times" />
                      </Button>
                    ) : null}
                  </Item>
                  {state.totalCustomerPay != 0 ? (
                    <View style={{ width: "100%" }}>
                      <Text style={styles.customer_pay_item}>
                        {I18n.t("customerRePay", {
                          locale: locale ? locale : "vn"
                        })}
                      </Text>
                      <Item style={{}} inlineLabel>
                        <Text
                          style={{ width: "100%", fontSize: 20, marginTop: 6 }}
                        >
                          {this.state.totalReturn.format()}
                          {" VNĐ"}
                        </Text>
                      </Item>
                    </View>
                  ) : null}
                </View>
              </Row>
            </Col>
          </Grid>
        </View>
        <PayModal
          show={this.state.isModalVisible && transactionCode != null}
          transactionCode={transactionCode}
          onClose={() => {
            this.setState({ isModalVisible: false });

            dispatch.pop();
            setTimeout(() => {
              billListAction.getBillList(
                bill.apartmentId,
                currentPage,
                pageSize,
                user
              );
            }, 15);
          }}
          onPay={async () => {
            await printBill(
              bill.listInvoiceDetail,
              state.paymentItemList,
              apartment.ownerName,
              user.fullName,
              transactionCode,
              bill.invoiceMonth,
              apartment.apartmentName
            );
          }}
        />
        <ConfirmModal
          show={this.state.isModalConfirm}
          onClose={() => this.setState({ isModalConfirm: false })}
          onProcess={() => {
            this.setState({ isModalVisible: true, isModalConfirm: false });
            billDetailAction.billPay(
              state.paymentItemList,
              bill,
              balance,
              user
            );
          }}
        />
      </Container>
    );
  }

  async printBill() {
    try {
      await AsyncStorage.getItem("@ReactNativeXprinter:default_printer")
        .then(address => {
          if (address && address != "") {
            RNXprinter.selectDevice(address);
          } else {
            RNXprinter.pickPrinter();
          }
        })
        .catch(() => {
          debugger;
          RNXprinter.pickPrinter();
        });
      RNXprinter.pushText("text center", 0, 1);
      RNXprinter.pushText("--------------------------------", 0, 1);
      // RNXprinter.pushText("bui dinh bach2", 0);
      // RNXprinter.pushText("bui dinh bach3", 0);
      // RNXprinter.pushText("bui dinh bach4", 0);
      // RNXprinter.pushText("bui dinh bach5", 0);
      // RNXprinter.pushText("bui dinh bach6", 0);
      // RNXprinter.pushFlashImage(0);
      // // Push Cut Paper
      // RNXprinter.pushCutPaper();
      RNXprinter.print();
    } catch (e) {
      debugger;
      Alert.alert(
        "Thông báo",
        "In hóa đơn thất bại, kiểm tra lại kết nối máy in !"
      );
    }
  }
}
function mapStateToProps(state, props) {
  return {
    billDetailReducer: state.billDetailReducer,
    loginReducer: state.loginReducer,
    billListReducer: state.billListReducer
  };
}
function mapToDispatch(dispatch) {
  return {
    billDetailAction: bindActionCreators(billDetailAction, dispatch),
    billListAction: bindActionCreators(billListAction, dispatch)
  };
}
billDetail = connect(mapStateToProps, mapToDispatch)(billDetail);

export default reduxForm({
  form: "billDetail"
})(billDetail);
