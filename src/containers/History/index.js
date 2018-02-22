import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  Alert
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
import HistoryPicker from "../../components/Historypicker";
import * as historyAction from "../../store/actions/containers/history_action";
const currentDate = new Date();
class history extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    this.state = { currentTime: currentMonth + "/" + currentYear };
    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
    Number.prototype.format = function (n, x) {
      var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
      return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
    };
  }

  componentDidMount() {
    const { historyAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    const { state } = this;
    historyAction.getHistory(
      navigation.state.params.apartment.apartmentId,
      state.currentTime,
      user
    );
  }

  HistoryPickerChange(month, year) {
    const { historyAction, navigation } = this.props;
    const { user } = this.props.loginReducer;
    let currentTime = month + "/" + year;
    this.setState({ currentTime: currentTime });
    historyAction.getHistory(
      navigation.state.params.apartment.apartmentId,
      currentTime,
      user
    );
  }

  _onPressHandle() {
    this.picker.toggle();
  }

  render() {
    const locale = "vn";
    const { dispatch } = this.props.navigation;
    const { historyAction, navigation } = this.props;
    const state = this.state;
    const { listResult, isLoading, historyError } = this.props.historyReducer;
    if (historyError == true) {
      Alert.alert("Thông báo", "Lấy danh sách lịch sử giao dịch thất bại kiểm tra lại đường truyền.", [{
        text: 'Ok',
        onPress: (e) => {
          historyAction.clearError();
        }
      }],
        { cancelable: false });
    }
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
          <Loading isShow={isLoading} />
          <HistoryPicker onChange={this.HistoryPickerChange.bind(this)} />
          <FlatList
            style={styles.listResult}
            data={listResult ? listResult : []}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderFlatListItem.bind(this)}
            numColumns={2}
          />
        </View>
      </Container>
    );
  }

  renderFlatListItem(dataItem) {
    const item = dataItem.item;
    const { dispatch } = this.props.navigation;
    const { listResult } = this.props.historyReducer;
    return (
      <TouchableOpacity
        key={item.index}
        style={
          listResult && listResult.length >= 2
            ? styles.item_container_half
            : styles.item_container_full
        }
      // onPress={() => dispatch.push({ id: "HistoryDetail", userId: 1 })}
      >
        <ItemHistory
          tranCode={item.paymentCode}
          date={item.paymentDate}
          isCash={item.paymentMethod == "CASH"}
          totalMoney={item.paymentAmount.format() + " VNĐ"}
          content={"TTHD " + item.invoiceMonth}
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
    historyReducer: state.historyReducer,
    loginReducer: state.loginReducer
  };
}
function mapToDispatch(dispatch) {
  return {
    historyAction: bindActionCreators(historyAction, dispatch)
  };
}
history = connect(mapStateToProps, mapToDispatch)(history);

export default reduxForm({
  form: "history"
})(history);
