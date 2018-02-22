import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
  Picker
} from "native-base";
import styles from "./styles";
import HeaderForm from "../../components/Header_form";
import HeaderContent from "../../components/Header_content";
import { connect } from "react-redux";
import { Grid, Col, Row } from "react-native-easy-grid";
import I18n from "../../i18n/i18n";
import { InputField } from "../../components/Element/Form/index";
import Icon from "react-native-vector-icons/FontAwesome";
import { Field, reduxForm } from "redux-form";
import { DateField } from "../../components/Element/Form";
import Bill from "../../components/Bill";
import ItemResult from "../../components/Item_result";
import * as billDetailAction from "../../store/actions/containers/billdetail_actions";
import * as billListAction from "../../store/actions/containers/billList_actions";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";
import PayModal from "../../components/PayModal";
import { TextInputMask } from "react-native-masked-text";
import { printBill } from "../../helper";
const resolveAssetSource = require("resolveAssetSource");
const userAvar = require("../../resources/assets/user.jpg");
const blockAction = false;
const blockLoadMoreAction = false;
class billList extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      totalCustomerPay: 0,
      totalReturn: 0,
      totalPay: 0,
      billStatus: "payYet"
    };
    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
  }

  componentDidMount() {
    const { billListAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    const { currentPage, pageSize } = this.props.billListReducer;
    setTimeout(() => {
      this.loading.show();
      billListAction.getBillList(
        navigation.state.params.apartment.apartmentId,
        currentPage,
        pageSize,
        user
      );
    });
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
    const { billListAction, navigation } = this.props;
    billListAction.reset();
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

  componentDidUpdate(prevProps, prevState) {

    if (this.loading.getState() == true) {
      this.loading.hide();
    }
    if (this.smallLoading.getState() == true) {
      this.smallLoading.hide();
    }
  }

  render() {
    const locale = "vn";
    const { transactionCode } = this.props.billDetailReducer;
    const isLoading1 = this.props.billDetailReducer.isLoading;
    const isLoading2 = this.props.billListReducer.isLoading;
    const isLoading = isLoading1 || isLoading2;
    const { dispatch, state } = this.props.navigation;
    const {
      listResult,
      balance,
      billError,
      totalDebit,
      currentPage,
      pageSize,
      billPayError
    } = this.props.billListReducer;
    const { key, userName, position, phone, avatarUrl } = this.props;
    const { billListAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    if (billError == true) {
      Alert.alert(
        "Thông Báo",
        "Lấy danh sách hóa đơn lỗi kiểm tra lại đường truyền", [{
          text: 'Ok',
          onPress: (e) => {
            billListAction.clearError();
          }
        }],
        { cancelable: false }
      );
    }
    if (billPayError == true) {
      Alert.alert(
        "Thông Báo",
        "Thanh toán hóa đơn lỗi kiểm tra lại đường truyền.", [{
          text: 'Ok',
          onPress: (e) => {
            billListAction.clearError();
          }
        }],
        { cancelable: false }
      );
    }
    return (
      <Container style={styles.container} >
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.container_outer}
          keyboardVerticalOffset={-350}
        >
          <Grid>
            <Col size={35} style={[styles.grid_col, styles.col_form]}>
              <HeaderForm
                onBack={() => {
                  if (!blockAction) {
                    blockAction = true;
                    dispatch.pop();
                    setTimeout(() => {
                      blockAction = false;
                    }, 1000);
                  }
                }}
                headerTitle={I18n.t("homeInfo", {
                  locale: locale ? locale : "vn"
                })}
              />
              <Content>
                <View style={styles.formContainer}>
                  {!this.state.keyBoardShow ? (
                    <Thumbnail
                      style={styles.thumbnail_avatar}
                      source={
                        state.params.apartment.avatarUrl
                          ? {
                            uri: state.params.apartment.avatarUrl
                          }
                          : userAvar
                      }
                      ref={thumbnail => {
                        this.thumbnail = thumbnail;
                      }}
                      // onError={(e) => {
                      //   this.thumbnail.setNativeProps({ src: [{ uri: "https://exelord.github.io/ember-initials/images/default-d5f51047d8bd6327ec4a74361a7aae7f.jpg" }] })
                      // }}
                      onError={e => {
                        this.thumbnail.setNativeProps({
                          src: [resolveAssetSource(userAvar)]
                        });
                      }}
                    />
                  ) : null}
                  <Item style={styles.item}>
                    <Label inlineLabel>
                      {I18n.t("homeOwner", {
                        locale: locale ? locale : "vn"
                      })}
                    </Label>
                    <H3 style={styles.textPadding}>
                      {state.params.apartment.ownerName}
                    </H3>
                  </Item>
                  {!this.state.keyBoardShow ? (
                    <View>
                      <View>
                        <Item style={styles.item}>
                          <Icon name="map-marker" style={styles.icon} />
                          <Text>{state.params.apartment.apartmentName}</Text>
                        </Item>
                        <Item style={styles.item}>
                          <Icon name="phone" style={styles.icon} />
                          <Text>{state.params.apartment.ownerPhone}</Text>
                        </Item>
                        {/* <Item style={styles.item}>
                      <Label inlineLabel>
                        {I18n.t("remainMoney", {
                          locale: locale ? locale : "vn"
                        })}
                      </Label>
                      <Text style={styles.textRemainMoney}>
                        {balance + " VNĐ"}
                      </Text>
                    </Item>
                    <Item style={styles.item}>
                      <Label inlineLabel>
                        {I18n.t("remainRent", {
                          locale: locale ? locale : "vn"
                        })}
                      </Label>
                      <Text style={styles.textRemainMoney}>
                        {totalDebit + " VNĐ"}
                      </Text>
                    </Item> */}
                      </View>
                      <Button
                        full
                        style={styles.buttonViewHistory}
                        onPress={() => {
                          if (!blockAction) {
                            blockAction = true;
                            dispatch.push({
                              id: "History",
                              apartment: navigation.state.params.apartment
                            });
                            setTimeout(() => {
                              blockAction = false;
                            }, 1000);
                          }
                        }}
                      >
                        <Text uppercase={false}>
                          {" "}
                          {I18n.t("viewHistory", {
                            locale: locale ? locale : "vn"
                          })}
                        </Text>
                      </Button>
                    </View>
                  ) : null}
                  <View
                    style={{
                      width: "100%",
                      paddingLeft: 15,
                      paddingRight: 15
                    }}
                  >
                    <Text style={[styles.customer_pay_item]}>
                      {I18n.t("customerPay", {
                        locale: locale ? locale : "vn"
                      })}
                    </Text>
                    <Item>
                      <TextInputMask
                        ref={"InputPay"}
                        style={{
                          width: "100%",
                          fontSize: 20
                        }}
                        placeholder="Số tiền thanh toán"
                        value={this.state.totalCustomerPay}
                        onChangeText={value => this.payChange(value)}
                        customTextInput={Input}
                        type={"money"}
                        options={{
                          unit: "",
                          suffixUnit: " VNĐ",
                          precision: 0,
                          separator: " ",
                          zeroCents: true
                        }}
                      />
                      {this.state.keyBoardShow ? (
                        <Button
                          transparent
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
                  </View>
                  {this.state.totalPay != 0 ? (
                    <View
                      style={{
                        width: "100%",
                        paddingLeft: 15,
                        paddingRight: 15
                      }}
                    >
                      <Text style={styles.customer_pay_item}>
                        {I18n.t("billTotal", {
                          locale: locale ? locale : "vn"
                        })}
                      </Text>
                      <Item style={{}} inlineLabel>
                        <TextInputMask
                          disabled={true}
                          style={{ width: "100%", fontSize: 20 }}
                          placeholder={I18n.t("customerRePay", {
                            locale: locale ? locale : "vn"
                          })}
                          value={this.state.totalPay}
                          customTextInput={Input}
                          type={"money"}
                          options={{
                            unit: "",
                            suffixUnit: " VNĐ",
                            precision: 0,
                            separator: " ",
                            zeroCents: true
                          }}
                        />
                      </Item>
                    </View>
                  ) : null}
                  {this.state.totalCustomerPay != 0 ? (
                    <View
                      style={{
                        width: "100%",
                        paddingLeft: 15,
                        paddingRight: 15
                      }}
                    >
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
              </Content>
              <View style={{ position: 'absolute', bottom: 4, left: 4, width: 34, height: 34 }}>
                <Loading ref={ref => {
                  this.smallLoading = ref;
                }} />
              </View>
            </Col>
            <Col size={65} style={[styles.grid_col, styles.col_content]}>
              <HeaderContent
                onBack={() => dispatch.pop()}
                showUser={true}
                headerTitle={I18n.t("billList", {
                  locale: locale ? locale : "vn"
                })}
              />
              <Container style={styles.listResult_container}>

                {/* <Item
                  style={{
                    width: "100%",
                    height: 40
                  }}
                >
                  <Picker
                    style={{
                      position: "absolute",
                      right: 8,
                      width: 180,
                      height: 40
                    }}
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.state.billStatus}
                    onValueChange={this.onBillStatusChange.bind(this)}
                  >
                    <Item label="Chưa thanh toán" value="payYet" />
                    <Item label="Thanh toán" value="payed" />
                    <Item label="Tất cả" value="all" />
                  </Picker>
                </Item> */}

                <FlatList
                  refreshControl={
                    <RefreshControl
                      colors={["#9Bd35A", "#689F38"]}
                      refreshing={isLoading}
                      onRefresh={() => {
                        this.loading.show();
                        setTimeout(() => {
                          billListAction.refreshBillList(
                            navigation.state.params.apartment.apartmentId,
                            currentPage,
                            pageSize,
                            user
                          )
                        }, 0);

                      }
                      }
                    />
                  }
                  style={styles.listResult}
                  data={listResult ? listResult : []}
                  keyExtractor={this._keyExtractor}
                  renderItem={this.renderFlatListItem.bind(this)}
                  numColumns={1}
                  onEndReached={({ distanceFromEnd }) => {
                    if (distanceFromEnd > 0) {
                      if (
                        !blockLoadMoreAction &&
                        !(listResult.length < pageSize)
                      ) {
                        blockLoadMoreAction = true;
                        this.smallLoading.show();
                        setTimeout(() => {
                          billListAction.loadMore(
                            navigation.state.params.apartment.apartmentId,
                            currentPage,
                            pageSize,
                            user
                          );
                        }, 0);

                        setTimeout(() => {
                          blockLoadMoreAction = false;
                        }, 600);
                      }
                    }
                  }}
                  onEndReachedThreshold={0.7}
                />
                <Loading ref={ref => {
                  this.loading = ref;
                }} isShow={isLoading} />
              </Container>
            </Col>
          </Grid>
        </KeyboardAvoidingView>
        <PayModal
          show={this.state.isModalVisible && transactionCode != null}
          transactionCode={transactionCode}
          onClose={() => {
            this.setState({ isModalVisible: false });
            setTimeout(() => {
              billListAction.getBillFromId(
                this.state.bill.apartmentId,
                this.state.bill.invoiceId,
                user
              );
            }, 0);
          }}
          onPay={async () => {
            this.setState({ isModalVisible: false });
            setTimeout(() => {
              billListAction.getBillFromId(
                this.state.bill.apartmentId,
                this.state.bill.invoiceId,
                user
              );
            }, 0);
            await printBill(
              this.state.listInvoiceDetail,
              this.state.listInvoiceDetail,
              state.params.apartment.ownerName,
              user.fullName,
              transactionCode,
              this.state.bill.invoiceMonth,
              state.params.apartment.apartmentName
            );
          }}
        />
        <ConfirmModal
          show={this.state.isModalConfirm}
          onClose={() => this.setState({ isModalConfirm: false })}
          onProcess={() => {
            this.setState({ isModalVisible: true, isModalConfirm: false });
            this._onPay(
              this.state.bill,
              this.state.listInvoiceDetail,
              this.state.payMethod
            );
          }}
        />
      </Container>
    );
  }

  onBillStatusChange(value) {
    this.setState({ billStatus: value });
    const { billListAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    const { currentPage, pageSize } = this.props.billListReducer;
    this.loading.show();
    setTimeout(() => {
      billListAction.getBillList(
        navigation.state.params.apartment.apartmentId,
        currentPage,
        pageSize,
        user
      );
    });
  }

  renderFlatListItem(dataItem) {
    const item = dataItem.item;
    const { dispatch } = this.props.navigation;
    const { balance, totalDebit } = this.props.billListReducer;
    const { apartment } = this.props.navigation.state.params;
    return (
      <TouchableOpacity
        key={item.index}
        style={styles.item_container}
        onPress={() => {
          if (!blockAction) {
            blockAction = true;
            if (item.invoiceStatus == "INCOMPLETE") {
              dispatch.push({
                id: "BillDetail",
                bill: item,
                balance: balance,
                totalDebit: totalDebit,
                apartment: apartment
              });
            }
            setTimeout(() => {
              blockAction = false;
            }, 1200);
          }
        }}
      >
        <Bill
          bill={item}
          listInvoiceDetail={item.listInvoiceDetail}
          invoiceStatus={item.invoiceStatus}
          invoiceMonth={item.invoiceMonth}
          onTotal={this.setTotalPay.bind(this)}
          onPayCash={(bill, listInvoiceDetail) => {
            this.setState({
              isModalConfirm: true,
              payMethod: "CASH",
              listInvoiceDetail: listInvoiceDetail,
              bill: bill
            });
          }}
          onPayCredit={(bill, listInvoiceDetail) => {
            this.setState({
              isModalConfirm: true,
              payMethod: "POS",
              listInvoiceDetail: listInvoiceDetail,
              bill: bill
            });
          }}
        />
      </TouchableOpacity>
    );
  }
  setTotalPay(_totalPay) {
    let _value = this.refs["InputPay"].getRawValue();
    if (this.isNumeric(_value)) {
      this.setState({
        totalCustomerPay: _value,
        totalPay: _totalPay,
        totalReturn: _value - _totalPay
      });
    }
  }

  _onPay(bill, listInvoiceDetail, payMethod) {
    const { apartment } = this.props.navigation.state.params;
    const { balance } = this.props.billListReducer;
    const { billDetailAction, billListAction } = this.props;
    const { user } = this.props.loginReducer;
    bill.accountBalance = balance;
    for (var i = 0; i < listInvoiceDetail.length; i++) {
      listInvoiceDetail[i].paymentMethod = payMethod;
    }
    listInvoiceDetail = listInvoiceDetail.filter((i, index) => {
      return i.invoiceDetailPaid <= 0;
    });
    billDetailAction.billPay(
      listInvoiceDetail,
      bill,
      balance,
      user,
      "LIST_INVOICE"
    );
  }

  _keyExtractor(item, index) {
    return index;
  }
}
function mapStateToProps(state, props) {
  return {
    billListReducer: state.billListReducer,
    billDetailReducer: state.billDetailReducer,
    loginReducer: state.loginReducer
  };
}
function mapToDispatch(dispatch) {
  return {
    billListAction: bindActionCreators(billListAction, dispatch),
    billDetailAction: bindActionCreators(billDetailAction, dispatch)
  };
}
billList = reduxForm({
  form: "billlist"
  // enableReinitialize: true
})(billList);
billList = connect(mapStateToProps, mapToDispatch)(billList);
export default billList;
