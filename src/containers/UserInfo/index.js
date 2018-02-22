import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  AsyncStorage,
  TextInput,
  Keyboard,
  ScrollView
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
  H1,
  H2,
  H3
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
import * as navigationAction from "../../store/actions/root_navigation/root_navigation_actions";
import * as helper from "../../helper";
import * as userInfoAction from "../../store/actions/containers/userInfo_action";
import * as AppConfig from "../../config/app_config";
const resolveAssetSource = require("resolveAssetSource");
const userAvar = require("../../resources/assets/user.jpg");
const blockAction = false;
const validate = values => {
  const error = {};
  // debugger;
  error.password = "";
  error.newPassword = "";
  error.rePassword = "";
  var password = values.password;
  var newPassword = values.newPassword;
  var rePassword = values.rePassword;
  if (values.password === undefined) {
    password = "";
  }
  if (values.newPassword === undefined) {
    newPassword = "";
  }
  if (values.rePassword === undefined) {
    rePassword = "";
  }
  if (password.length == 0 || password == "") {
    error.password = "empty";
  }
  if (newPassword.length == 0 || newPassword == "") {
    error.newPassword = "empty";
  }
  if (rePassword.length == 0 || rePassword == "") {
    error.rePassword = "empty";
  }
  if (!(rePassword.length == 0 || rePassword == "") && rePassword != newPassword) {
    error.rePassword = "Không khớp";
  }
  return error;
};
class userInfo extends Component {
  static navigationOptions = {
    header: null
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
      identification: "",
      isChangePw: false
    };

    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
  }
  componentDidMount() {
    setTimeout(() => {
      this.getUser();
    }, 0);
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
    setTimeout(() => {
      this.refs.content.scrollToEnd({ animated: true })
    }, 0);

  }

  _keyboardDidHide() {
    // this.setState({ keyBoardShow: false });
  }


  getUser() {
    try {
      const user = {};
      const { userInfoAction } = this.props;
      const hadUser = AsyncStorage.getItem("@user")
        .then(value => {
          // alert(value);
          user = JSON.parse(value);
          if (user) {
            userInfoAction._getUser(user);
          }
        })
        .done();
    } catch (error) {
      alert(error);
      // Error retrieving data
    }
  }
  onSearchClick() {
    const { dispatch } = this.props.navigation;
    if (!blockAction) {
      blockAction = true;
      dispatch.reset("Search");
      setTimeout(() => {
        blockAction = false;
      }, 800);
    }
  }
  /**
   *
   *
   * @returns
   * @memberof userInfo
   */
  render() {
    const locale = "vn";
    const { handleSubmit } = this.props;
    const { state } = this;
    return (
      <Container style={styles.container}>
        <Header
          headerTitle={I18n.t("userinfo", {
            locale: locale ? locale : "vn"
          })}
          showSearch={true}
          onSearch={this.onSearchClick.bind(this)}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.container_info_outer}
          keyboardVerticalOffset={-250}
        >
          <View style={styles.container_info_inter}>
            <ScrollView ref="content">
              <Item
                style={[
                  styles.itemAvatar,
                  styles.item_margin,
                  styles.borderBottomNone
                ]}
              >
                <Thumbnail
                  style={styles.thumbnail_avatar}
                  source={
                    this.props.user.avatar
                      ? {
                        uri: `${AppConfig.API_HOST}${this.props.user.avatar}`
                      }
                      : userAvar
                  }
                  ref={thumbnail => {
                    this.thumbnail = thumbnail;
                  }}
                  onError={e => {
                    this.thumbnail.setNativeProps({
                      src: [resolveAssetSource(userAvar)]
                    });
                  }}
                />
                <Button
                  style={styles.button_edit}
                  onPress={() => this.setState({ isEdit: true })}
                  transparent
                >
                  {/* <Icon size={27} name="edit" /> */}
                </Button>
              </Item>
              <Item
                style={[
                  styles.item_margin,
                  styles.borderBottomNone,
                  styles.center
                ]}
              >
                <H3 style={styles.textPadding}>{this.props.user.fullName}</H3>
              </Item>
              {!this.state.isChangePw ? <Item
                style={[
                  styles.item_margin,
                  styles.borderBottomNone,
                  styles.center
                ]}
              >
                <H3 style={styles.textPadding}>
                  {"CMTND: "}
                  {this.props.user.identification
                    ? this.props.user.identification
                    : ""}
                </H3>
              </Item> : null}

              <Form>
                {!this.state.isChangePw ? <View>
                  <Field
                    name="birthDay"
                    // disabled={!this.state.isEdit}
                    style={styles.infoField}
                    placeholder={I18n.t("birthday", {
                      locale: locale ? locale : "vi"
                    })}
                    component={DateField}
                    icon="calendar"
                  />
                  <Field
                    name="phoneNumber"
                    disabled={!this.state.isEdit}
                    style={styles.infoField}
                    placeholder={I18n.t("mobile", {
                      locale: locale ? locale : "vi"
                    })}
                    type="text"
                    component={InputField}
                    icon="volume-control-phone"
                  />
                  <Field
                    name="email"
                    disabled={!this.state.isEdit}
                    style={styles.infoField}
                    placeholder={I18n.t("email", {
                      locale: locale ? locale : "vi"
                    })}
                    component={InputField}
                    icon="comment"
                  />
                  <Field
                    name="username"
                    disabled={!this.state.isEdit}
                    style={styles.infoField}
                    placeholder={I18n.t("user", {
                      locale: locale ? locale : "vi"
                    })}
                    component={InputField}
                    icon="user-o"
                  />
                </View> :
                  <View>
                    <Item>
                      <Field
                        name="password"
                        style={styles.infoField}
                        placeholder={I18n.t("password", {
                          locale: locale ? locale : "vi"
                        })}
                        type="text"
                        component={InputField}
                        icon="unlock-alt"
                        secureTextEntry={true}
                      />
                    </Item>
                    <Item>
                      <Field
                        name="newPassword"
                        style={styles.infoField}
                        placeholder={I18n.t("newpassword", {
                          locale: locale ? locale : "vi"
                        })}
                        secureTextEntry={true}
                        type="text"
                        component={InputField}
                        icon="unlock-alt"
                      />
                    </Item>
                    <Item>
                      <Field
                        name="rePassword"
                        style={styles.infoField}
                        placeholder={I18n.t("repassword", {
                          locale: locale ? locale : "vi"
                        })}
                        type="text"
                        secureTextEntry={true}
                        component={InputField}
                        icon="unlock-alt"
                      />
                    </Item>
                  </View>}
                <Item
                  style={[styles.borderBottomNone, styles.itemButton_changepw]}
                >
                  {!this.state.isChangePw ? <Button
                    full
                    style={styles.button_changepassword}
                    disabled
                    onPress={() => this.setState({ isChangePw: true })}
                  >
                    <Text>
                      {I18n.t("changePassword", {
                        locale: locale ? locale : "vi"
                      })}
                    </Text>
                  </Button> : <Item style={styles.borderBottomNone}>
                      <Button
                        full
                        style={styles.button_changepassword_save}
                        onPress={handleSubmit((val) => { debugger })}
                      >
                        <Text>
                          {I18n.t("changePassword", {
                            locale: locale ? locale : "vi"
                          })}
                        </Text>
                      </Button>
                      <Button
                        full
                        style={styles.button_cancel}
                        onPress={() => this.setState({ isChangePw: false })}
                      >
                        <Text>
                          {I18n.t("cancel", {
                            locale: locale ? locale : "vi"
                          })}
                        </Text>
                      </Button>
                    </Item>
                  }

                </Item>
              </Form>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

function mapStateToProps(state, props) {
  try {
    if (state.userInfoReducer.user.birthDay) {
      state.userInfoReducer.user.birthDay = new Date(state.userInfoReducer.user.birthDay);
    }
  } catch (error) {

  }
  debugger;
  return {
    initialValues: state.userInfoReducer.user,
    user: state.userInfoReducer.user
  };
}
function mapToDispatch(dispatch) {
  return {
    userInfoAction: bindActionCreators(userInfoAction, dispatch)
  };
}

userInfo = reduxForm({
  form: "userInfo",
  validate,
  enableReinitialize: true
})(userInfo);
userInfo = connect(mapStateToProps, mapToDispatch)(userInfo);
export default userInfo;
