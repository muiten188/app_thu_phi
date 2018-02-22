import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  View,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  AsyncStorage,
  Alert
} from "react-native";
import { Button, Text, Thumbnail } from "native-base";
import Icon from "react-native-vector-icons/EvilIcons";
import * as loginAction from "../../authen/actions/login_action";
import * as appAction from "../../store/actions/app_action";
import * as AppConfig from "../../config/app_config";
import styles from "./styles";
const resolveAssetSource = require("resolveAssetSource");
const userAvar = require("../../resources/assets/user.jpg");
const ICON_SIZE = 24;
import RNXprinter from "react-native-xprinter";

class user extends React.Component {
  handleShowPopupError = () => {
    // show error here
  };

  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      username: "",
      fullName: "",
      phoneNumber: "",
      birthDay: "",
      email: "",
      avatar: "",
      identification: ""
    };
  }

  _onPress(e, i) {
    const { loginAction, appAction } = this.props;
    if (i == 1) {
      appAction.showPayInfo();
    } else if (i == 2) {
      RNXprinter.pickPrinter();
    } else if (i == 3) {
      RNXprinter.printDemoPage()
        .then((value, mes) => {})
        .catch(e => {
          Alert.alert("Thông báo", "Vui lòng kết nối máy in trước khi in thử!");
        });
    } else if (i == 4) {
      loginAction.logout();
    }
  }

  handleMenuPress = () => {
    const { actions } = this.props;

    UIManager.showPopupMenu(
      findNodeHandle(this.refs.menu),
      [
        this.state.fullName,
        "Thanh toán trong ngày",
        "Chọn máy in mặc định",
        "In thử",
        ...actions
      ],
      this.handleShowPopupError,
      this._onPress.bind(this)
    );
  };

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    try {
      const user = {};
      const hadUser = AsyncStorage.getItem("@user")
        .then(value => {
          user = JSON.parse(value);
          if (user) {
            this.setState({
              username: user.username,
              fullName: user.fullName,
              phoneNumber: user.phoneNumber,
              birthDay: user.birthDay,
              email: user.email,
              avatar: user.avatar,
              identification: user.identification
            });
          }
        })
        .done();
    } catch (error) {
      alert(error);
      // Error retrieving data
    }
  }

  render() {
    const { state } = this;
    return (
      <View>
        {this.props.children}
        <Button
          transparent
          onPress={this.handleMenuPress}
          style={{
            alignSelf: "center",
            backgroundColor: "transparent",
            paddingLeft: 15,
            paddingRight: 15
          }}
        >
          <Thumbnail
            ref="menu"
            style={styles.thumbnail_avatar}
            source={
              this.state.avatar
                ? {
                    uri: `${AppConfig.API_HOST}${this.state.avatar}`
                  }
                : userAvar
            }
            ref={thumbnail => {
              this.thumbnail = thumbnail;
            }}
            onError={e => {
              // this.thumbnail.setNativeProps({
              //   src: [resolveAssetSource(userAvar)]
              // });
            }}
          />
          <Icon name="user" size={0} color="white" ref="menu" />
          <Text>{this.state.fullName}</Text>
        </Button>
      </View>
    );
  }
}
function mapStateToProps(state, props) {
  return {
    //loginReducer: state.loginReducer,
  };
}
function mapToDispatch(dispatch) {
  return {
    loginAction: bindActionCreators(loginAction, dispatch),
    appAction: bindActionCreators(appAction, dispatch)
  };
}

user = connect(mapStateToProps, mapToDispatch)(user);
export default user;
