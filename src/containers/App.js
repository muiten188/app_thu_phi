import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from "react-native";
import { Container } from "native-base";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Provider } from "react-redux";

import AuthenNavigation from "../routers/authen_navigation";
import RootNavigaion from "../routers/root_navigation";
import PayInfoModal from "../components/PayInfoModal";
import * as appAction from "../store/actions/app_action";
// import { startAsyncValidation } from "../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/redux-form";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loged: false
    };
  }

  render() {
    let { loginReducer, appAction } = this.props;
    let { showPayInfo } = this.props.app_Reducer;
    if (loginReducer.Logout == true) {
      AsyncStorage.setItem("@user", "");
    } else if (
      loginReducer.authen_expri == true &&
      loginReducer.Logged == true
    ) {
      Alert.alert(
        "Thông báo",
        "Phiên làm việc của bạn đã hết vui lòng đăng nhập lại."
      );
    } else if (loginReducer.Logged == true) {
      try {
        AsyncStorage.setItem("@user", JSON.stringify(loginReducer.user));
      } catch (error) {
        // console.log("save error");
      }
    }
    if (!loginReducer || !loginReducer.Logged) {
      return <AuthenNavigation />;
    }
    return (
      <Container>
        <RootNavigaion />
        {showPayInfo ? (
          <PayInfoModal show={true} onOk={this._closePayInfo.bind(this)} onClearError={this._clearPayListError.bind(this)} />
        ) : null}
      </Container>
    );
  }
  _closePayInfo() {
    const { appAction } = this.props;
    appAction.closePayInfo();
  }
  _clearPayListError() {
    const { appAction } = this.props;
    appAction.clearPayListError();
  }
}

function mapStateToProps(state, props) {
  return {
    loginReducer: state.loginReducer,
    app_Reducer: state.app_Reducer
  };
}
function mapToDispatch(dispatch) {
  return {
    appAction: bindActionCreators(appAction, dispatch)
  };
}
export default connect(mapStateToProps, mapToDispatch)(App);
