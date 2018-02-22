import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList
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
import { InputField } from "../../components/Element/Form/index";
import Icon from "react-native-vector-icons/FontAwesome";
import { Field, reduxForm } from "redux-form";
import { DateField } from "../../components/Element/Form";
import ItemHistory from "../../components/Item_history";
import Loading from "../../components/Loading";
import * as navigationAction from "../../store/actions/root_navigation/root_navigation_actions";

class historyDetail extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      rentCashPay: false,
      rentCreditPay: false,
      electricCashPay: false,
      electricCreditPay: false,
      waterCashPay: false,
      waterCreditPay: false,
      buildingCashPay: false,
      buildingCreditPay: false,
      bikeCashPay: false,
      bikeCreditPay: false,
      carCashPay: false,
      carCreditPay: false,
      useRemainCashPay: false,
      useRemainCreditPay: false
    };
    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
  }

  onSearchClick() {
    const { dispatch } = this.props.navigation;
    dispatch.push({ id: "Search" });
  }

  _onPressHandle() {
    this.picker.toggle();
  }

  render() {
    const locale = "vn";
    const { dispatch } = this.props.navigation;
    const state = this.state;
    const listResult = [
      { key: "a" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" },
      { key: "b" },
      { key: "b" },
      { key: "b" },
      { key: "f" }
    ];
    return (
      <Container style={styles.container}>
        <Header
          headerTitle={I18n.t("history", {
            locale: locale ? locale : "vn"
          })}
          showButtonLeft={true}
          onBack={() => dispatch.pop()}
          // showSearch={true}
          // onSearch={this.onSearchClick.bind(this)}
          showUser={true}
        />
        <View style={styles.container_info_outer}>
          {/* <Loading /> */}
          <View style={styles.header_content}>
            <Grid>
              <Col style={styles.centerLeft}>
                <Item style={[styles.borderBottomNone, styles.item_header]}>
                  <Label>
                    {I18n.t("time", {
                      locale: locale ? locale : "vn"
                    })}
                  </Label>
                  <Text>31/07/2017</Text>
                </Item>
                <Item style={[styles.borderBottomNone, styles.item_header]}>
                  <Label>
                    {I18n.t("content", {
                      locale: locale ? locale : "vn"
                    })}
                  </Label>
                  <Text>TTHD 7/2017</Text>
                </Item>
              </Col>
              <Col style={styles.centerRight}>
                <Item style={[styles.borderBottomNone, styles.item_header]}>
                  <Label>
                    {I18n.t("tranCode", {
                      locale: locale ? locale : "vn"
                    })}
                  </Label>
                  <H3 style={[styles.tranCode, styles.textPadding]}>
                    GD-2-171006-2017
                  </H3>
                </Item>
                <Item style={[styles.borderBottomNone, styles.item_header]}>
                  <Label>
                    {I18n.t("supportStaff", {
                      locale: locale ? locale : "vn"
                    })}
                  </Label>
                  <Text>LinhNH</Text>
                </Item>
              </Col>
            </Grid>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Grid>
              <Col style={styles.titleCol}>
                <Row style={styles.row_Header}>
                  <Text />
                </Row>
                <Row style={styles.rowRent}>
                  <H3 style={styles.textPadding}>
                    {I18n.t("rentFisrt", {
                      locale: locale ? locale : "vn"
                    })}
                  </H3>
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    {/* <Row style={styles.rowDetail_inner_title}>
                      <H3>
                        {I18n.t("billCostTitle", {
                          locale: locale ? locale : "vn"
                        })}{" "}
                        {"T12"}
                      </H3>
                    </Row> */}
                    <Row style={styles.rowDetail_inner}>
                      <Item style={styles.borderBottomNone}>
                        <Icon name="plug" style={[styles.icon]} />
                        <Label>
                          {I18n.t("electricCost", {
                            locale: locale ? locale : "vn"
                          })}
                        </Label>
                      </Item>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Item style={styles.borderBottomNone}>
                        <Icon name="tint" style={[styles.icon]} />
                        <Label>
                          {I18n.t("waterCost", {
                            locale: locale ? locale : "vn"
                          })}
                        </Label>
                      </Item>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Item style={styles.borderBottomNone}>
                        <Icon name="building" style={[styles.icon]} />
                        <Label>
                          {I18n.t("buildingCost", {
                            locale: locale ? locale : "vn"
                          })}
                        </Label>
                      </Item>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Item style={styles.borderBottomNone}>
                        <Icon name="motorcycle" style={[styles.icon]} />
                        <Label>
                          {I18n.t("bikeCost", {
                            locale: locale ? locale : "vn"
                          })}
                        </Label>
                      </Item>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Item style={styles.borderBottomNone}>
                        <Icon name="car" style={[styles.icon]} />
                        <Label>
                          {I18n.t("carCost", {
                            locale: locale ? locale : "vn"
                          })}
                        </Label>
                      </Item>
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse} />
                <Row style={styles.lastRow} />
              </Col>
              <Col>
                <Row style={styles.row_Header}>
                  <H2 style={styles.textPadding}>
                    {I18n.t("bill2", {
                      locale: locale ? locale : "vn"
                    })}
                  </H2>
                </Row>
                <Row style={styles.rowRent}>
                  <Text>350.000.000 VNĐ</Text>
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    <Row style={styles.rowDetail_inner}>
                      <Text>500.000 VNĐ</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>350.000 VNĐ</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>500.000 VNĐ</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>100.000 VNĐ</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>1.100.000 VNĐ</Text>
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse}>
                  <Text>100.000 VNĐ</Text>
                </Row>
                <Row style={styles.lastRow} />
              </Col>
              <Col>
                <Row style={styles.row_Header}>
                  <H2 style={styles.textPadding}>
                    {I18n.t("remain", {
                      locale: locale ? locale : "vn"
                    })}
                  </H2>
                </Row>
                <Row style={styles.rowRent_checkBox}>
                  <CheckBox
                    color={"#054f9a"}
                    checked={state.rentCashPay}
                    onPress={() =>
                      state.rentCashPay == true
                        ? this.setState({ rentCashPay: false })
                        : this.setState({ rentCashPay: true })
                    }
                  />
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    {/* <Row style={styles.rowDetail_inner_title} /> */}
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.electricCashPay}
                        onPress={() =>
                          state.electricCashPay == true
                            ? this.setState({ electricCashPay: false })
                            : this.setState({ electricCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.waterCashPay}
                        onPress={() =>
                          state.waterCashPay == true
                            ? this.setState({ waterCashPay: false })
                            : this.setState({ waterCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.buildingCashPay}
                        onPress={() =>
                          state.buildingCashPay == true
                            ? this.setState({ buildingCashPay: false })
                            : this.setState({ buildingCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.bikeCashPay}
                        onPress={() =>
                          state.bikeCashPay == true
                            ? this.setState({ bikeCashPay: false })
                            : this.setState({ bikeCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.carCashPay}
                        onPress={() =>
                          state.carCashPay == true
                            ? this.setState({ carCashPay: false })
                            : this.setState({ carCashPay: true })
                        }
                      />
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse}>
                  <Text>100</Text>
                </Row>
                <Row style={styles.lastRow} />
              </Col>
              <Col>
                <Row style={styles.row_Header}>
                  <H2 style={styles.textPadding}>
                    {I18n.t("cash", {
                      locale: locale ? locale : "vn"
                    })}
                  </H2>
                </Row>
                <Row style={styles.rowRent_checkBox}>
                  <CheckBox
                    color={"#054f9a"}
                    checked={state.rentCashPay}
                    onPress={() =>
                      state.rentCashPay == true
                        ? this.setState({ rentCashPay: false })
                        : this.setState({ rentCashPay: true })
                    }
                  />
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    {/* <Row style={styles.rowDetail_inner_title} /> */}
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.electricCashPay}
                        onPress={() =>
                          state.electricCashPay == true
                            ? this.setState({ electricCashPay: false })
                            : this.setState({ electricCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.waterCashPay}
                        onPress={() =>
                          state.waterCashPay == true
                            ? this.setState({ waterCashPay: false })
                            : this.setState({ waterCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.buildingCashPay}
                        onPress={() =>
                          state.buildingCashPay == true
                            ? this.setState({ buildingCashPay: false })
                            : this.setState({ buildingCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.bikeCashPay}
                        onPress={() =>
                          state.bikeCashPay == true
                            ? this.setState({ bikeCashPay: false })
                            : this.setState({ bikeCashPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.carCashPay}
                        onPress={() =>
                          state.carCashPay == true
                            ? this.setState({ carCashPay: false })
                            : this.setState({ carCashPay: true })
                        }
                      />
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse}>
                  <Text>100</Text>
                </Row>
                <Row style={styles.lastRow} />
              </Col>
              <Col>
                <Row style={styles.row_Header}>
                  <H2 style={styles.textPadding}>
                    {I18n.t("credit", {
                      locale: locale ? locale : "vn"
                    })}
                  </H2>
                </Row>
                <Row style={styles.rowRent_checkBox}>
                  <CheckBox
                    color={"#054f9a"}
                    checked={state.rentCreditPay}
                    onPress={() =>
                      state.rentCreditPay == true
                        ? this.setState({ rentCreditPay: false })
                        : this.setState({ rentCreditPay: true })
                    }
                  />
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.electricCreditPay}
                        onPress={() =>
                          state.electricCreditPay == true
                            ? this.setState({ electricCreditPay: false })
                            : this.setState({ electricCreditPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.waterCreditPay}
                        onPress={() =>
                          state.waterCreditPay == true
                            ? this.setState({ waterCreditPay: false })
                            : this.setState({ waterCreditPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.buildingCreditPay}
                        onPress={() =>
                          state.buildingCreditPay == true
                            ? this.setState({ buildingCreditPay: false })
                            : this.setState({ buildingCreditPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.bikeCreditPay}
                        onPress={() =>
                          state.bikeCreditPay == true
                            ? this.setState({ bikeCreditPay: false })
                            : this.setState({ bikeCreditPay: true })
                        }
                      />
                    </Row>
                    <Row style={styles.rowDetail_inner_checkBox}>
                      <CheckBox
                        color={"#054f9a"}
                        checked={state.carCreditPay}
                        onPress={() =>
                          state.carCreditPay == true
                            ? this.setState({ carCreditPay: false })
                            : this.setState({ carCreditPay: true })
                        }
                      />
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse}>
                  <Text>200</Text>
                </Row>
                <Row style={styles.lastRow} />
              </Col>
              <Col>
                <Row style={styles.row_Header}>
                  <H2 style={styles.textPadding}>
                    {I18n.t("remain2", {
                      locale: locale ? locale : "vn"
                    })}
                  </H2>
                </Row>
                <Row style={styles.rowRent}>
                  <Text>0</Text>
                </Row>
                <Row style={styles.billDetailRow}>
                  <Col>
                    <Row style={styles.rowDetail_inner}>
                      <Text>0</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>0</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>0</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>0</Text>
                    </Row>
                    <Row style={styles.rowDetail_inner}>
                      <Text>0</Text>
                    </Row>
                  </Col>
                </Row>
                <Row style={styles.rowUse}>
                  <Text>100.000 VNĐ</Text>
                </Row>
                <Row style={styles.lastRow} />
              </Col>
            </Grid>
          </View>
        </View>
      </Container>
    );
  }

  renderFlatListItem(dataItem) {
    const item = dataItem.item;
    const { dispatch } = this.props.navigation;
    return (
      <TouchableOpacity
        key={item.index}
        style={styles.item_container}
        onPress={() => dispatch.push({ id: "BillList", userId: 1 })}
      >
        <ItemHistory
          tranCode={"GD-2-171006-2017"}
          date={"31/08/2017"}
          isCash={false}
          totalMoney={"1.500.000"}
          content={"TTHD 8/2017"}
        />
      </TouchableOpacity>
    );
  }
  _keyExtractor(item, index) {
    return index;
  }
}

function mapStateToProps(state, props) {
  return {
    // navigationReducer: state.navigationReducer
  };
}
function mapToDispatch(dispatch) {
  return {
    //navigationAction: bindActionCreators(navigationAction, dispatch),
  };
}
historyDetail = connect(mapStateToProps, mapToDispatch)(historyDetail);

export default reduxForm({
  form: "historyDetail"
})(historyDetail);
