import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
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
  H3
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
import ItemResult from "../../components/Item_result";
import * as searchAction from "../../store/actions/containers/search_action";
import Loading from "../../components/Loading";
import FormSearch from "./form_search";
const blockAction = false;
const blockLoadMoreAction = false;

class search extends Component {
  currentApartment = {};
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isEdit: false
    };
    I18n.defaultLocale = "vi";
    I18n.locale = "vi";
    I18n.currentLocale();
  }

  componentDidMount() {
    // const { searchAction } = this.props;
    // const { user } = this.props.loginReducer;
    // const { currentPage, pageSize } = this.props.searchReducer;
    // if (!blockAction) {
    //   blockAction = true;
    //   setTimeout(() => {
    //     searchAction.search({}, currentPage, pageSize, user);
    //   });
    //   setTimeout(() => {
    //     blockAction = false;
    //   }, 500)
    // }
  }
  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props.navigation;
    const { isLoading, listResult } = this.props.searchReducer;
    if (this.loading.getState() == true) {
      this.loading.hide();
    }
    if (this.smallLoading.getState() == true) {
      this.smallLoading.hide();
    }
    if (
      listResult.length == 1 &&
      listResult[0].apartmentId != this.currentApartment.apartmentId
    ) {
      if (!blockAction) {
        blockAction = true;
        this.currentApartment = listResult[0];
        dispatch.push({ id: "BillList", apartment: listResult[0] });
        setTimeout(() => {
          blockAction = false;
        }, 700);
      }
    }
  }

  render() {
    const locale = "vn";
    const { dispatch } = this.props.navigation;
    const {
      listResult,
      isLoading,
      searchErorr,
      valuesForm,
      currentPage,
      pageSize,
      loadEnd
    } = this.props.searchReducer;
    blockLoadMoreAction = loadEnd;
    const { searchAction } = this.props;
    const { user } = this.props.loginReducer;
    if (searchErorr == true) {
      Alert.alert(
        "Thông báo",
        "Tìm kiếm lỗi kiểm tra lại đường truyền.",
        [
          {
            text: "Ok",
            onPress: e => {
              searchAction.clearError();
            }
          }
        ],
        { cancelable: false }
      );
    }
    return (
      <Container style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.container_outer}
          keyboardVerticalOffset={-350}
        >
          <Grid>
            <Col size={32} style={[styles.grid_col, styles.col_form]}>
              <HeaderForm
                onBack={() => {
                  if (!blockAction) {
                    blockAction = true;
                    searchAction.searchReset();
                    dispatch.push({ id: "UserInfo" });
                    setTimeout(() => {
                      blockAction = false;
                    }, 700);
                  }
                }}
                headerTitle={I18n.t("searchInfo", {
                  locale: locale ? locale : "vn"
                })}
              />
              <Content>
                <FormSearch
                  searchAction={values => {
                    this.loading.show();
                    searchAction.search(values, currentPage, pageSize, user);
                    //this.setState({ a: 1 }, () => this.loading.hide());
                  }}
                  temshow={() => { }}
                  scrollUp={() => {
                    if (listResult.length > 0) {
                      this.list.scrollToIndex({ index: 0 });
                    }
                  }}
                // user={user}
                />



              </Content>
              <View style={{ position: 'absolute', bottom: 4, left: 4, width: 34, height: 34 }}>
                <Loading ref={ref => {
                  this.smallLoading = ref;
                }} />
              </View>
            </Col>
            <Col size={68} style={[styles.grid_col, styles.col_content]}>
              <HeaderContent
                onBack={() => {
                  dispatch.pop();
                }}
                showUser={true}
                headerTitle={I18n.t("result", {
                  locale: locale ? locale : "vn"
                })}
              />
              <Container style={styles.listResult_container}>
                <FlatList
                  ref={ref => {
                    this.list = ref;
                  }}
                  style={styles.listResult}
                  data={listResult ? listResult : []}
                  keyExtractor={this._keyExtractor}
                  renderItem={this.renderFlatListItem.bind(this)}
                  numColumns={2}
                  onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                  onEndReached={({ distanceFromEnd }) => {
                    if (distanceFromEnd > 0) {
                      // this.onEndReachedCalledDuringMomentum = true;
                      if (
                        !blockLoadMoreAction &&
                        !(listResult.length < pageSize)
                      ) {

                        blockLoadMoreAction = true;
                        this.smallLoading.show(),
                          setTimeout(() => {
                            searchAction.loadMore(
                              valuesForm,
                              currentPage,
                              pageSize,
                              user
                            )
                          }, 0);

                        setTimeout(() => {
                          if (loadEnd != true) {
                            blockLoadMoreAction = false;
                          }
                        }, 700);
                      }
                    }
                  }}
                  onEndReachedThreshold={0.7}
                />
                <Loading
                  ref={ref => {
                    this.loading = ref;
                  }}
                  isShow={isLoading}
                />
              </Container>
            </Col>
          </Grid>
        </KeyboardAvoidingView>
      </Container>
    );
  }

  renderFlatListItem(dataItem) {
    const item = dataItem.item;
    const { dispatch } = this.props.navigation;
    const { listResult } = this.props.searchReducer;
    return (
      <TouchableOpacity
        key={item.index}
        style={
          listResult && listResult.length >= 2
            ? styles.item_container_half
            : styles.item_container_full
        }
        onPress={() => {
          if (!blockAction) {
            blockAction = true;
            dispatch.push({ id: "BillList", apartment: item });
            setTimeout(() => {
              blockAction = false;
            }, 800);
          }
        }}
      >
        <ItemResult
          key={item.index}
          userName={item.ownerName}
          position={item.apartmentName}
          phone={item.ownerPhone}
          avatarUrl={item.avatarUrl}
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
    searchReducer: state.searchReducer,
    loginReducer: state.loginReducer
  };
}
function mapToDispatch(dispatch) {
  return {
    searchAction: bindActionCreators(searchAction, dispatch)
  };
}
// export default reduxForm({
//   form: "search"
// })(connect(mapStateToProps, mapToDispatch)(search));

// search = reduxForm({
//   form: "search"
//   // enableReinitialize: true
// })(search);
search = connect(mapStateToProps, mapToDispatch)(search);
export default search;
