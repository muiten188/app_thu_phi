import React, { Component } from "react";

import {
  Text,
  Button,
  Form,
} from "native-base";
import styles from "./styles";
import { Grid, Col, Row } from "react-native-easy-grid";
import I18n from "../../i18n/i18n";
import { InputField } from "../../components/Element/Form/index";
import Icon from "react-native-vector-icons/FontAwesome";
import { Field, reduxForm } from "redux-form";
const blockAction = false;
const blockLoadMoreAction = false;
class FormSearch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const locale = "vn";
    isLoading = false;
    const { searchAction, handleSubmit, temshow, scrollUp, user } = this.props;
    return (
      <Form style={styles.formContainer}>
        <Grid>
          <Row style={styles.x3Row}>
            <Col style={styles.icon_col}>
              <Icon style={styles.icon} name="map-marker" />
            </Col>
            <Col style={styles.border}>
              <Row style={[styles.border, styles.fieldForm]}>
                <Field
                  name="buildingCode"
                  placeholder={I18n.t("building", {
                    locale: locale ? locale : "vi"
                  })}
                  component={InputField}
                  onClear={() => {
                    this.props.change("buildingCode", "");
                  }}
                  onFocus={() => {
                    this.props.change("buildingCode", "");
                  }}
                  onSubmitEditing={handleSubmit(values => {
                    if (!blockAction) {
                      blockAction = true;
                      temshow();
                      setTimeout(() => {
                        searchAction(values);
                      }, 0);
                      setTimeout(() => {
                        scrollUp();
                      }, 0);
                      setTimeout(() => {
                        blockAction = false;
                      }, 700);
                    }
                  })}
                />
              </Row>
              <Row style={[styles.border, styles.fieldForm]}>
                <Field
                  name="floorCode"
                  placeholder={I18n.t("floor", {
                    locale: locale ? locale : "vi"
                  })}
                  component={InputField}
                  onClear={() => {
                    this.props.change("floorCode", "");
                  }}
                  onFocus={() => {
                    this.props.change("floorCode", "");
                  }}
                  onSubmitEditing={handleSubmit(values => {
                    if (!blockAction) {
                      blockAction = true;
                      temshow();
                      setTimeout(() => {
                        searchAction(values);
                      }, 0);
                      setTimeout(() => {
                        scrollUp();
                      }, 0);
                      setTimeout(() => {
                        blockAction = false;
                      }, 700);
                    }
                  })}
                />
              </Row>
              <Row style={[styles.border, styles.fieldForm]}>
                <Field
                  name="aparmentName"
                  placeholder={I18n.t("apartmentNo", {
                    locale: locale ? locale : "vi"
                  })}
                  component={InputField}
                  onClear={() => {
                    this.props.change("aparmentName", "");
                  }}
                  onFocus={() => {
                    this.props.change("aparmentName", "");
                  }}
                  onSubmitEditing={handleSubmit(values => {
                    if (!blockAction) {
                      blockAction = true;
                      temshow();
                      setTimeout(() => {
                        searchAction(values);
                      }, 0);
                      setTimeout(() => {
                        scrollUp();
                      }, 0);
                      setTimeout(() => {
                        blockAction = false;
                      }, 700);
                    }
                  })}
                />
              </Row>
            </Col>
          </Row>
          <Row style={styles.normalRow}>
            <Col style={styles.icon_col}>
              <Icon style={styles.icon} name="user-circle-o" />
            </Col>
            <Col style={[styles.border, styles.fieldForm]}>
              <Field
                name="fullName"
                placeholder={I18n.t("homeName", {
                  locale: locale ? locale : "vi"
                })}
                component={InputField}
                onClear={() => {
                  this.props.change("fullName", "");
                }}
                onFocus={() => {
                  this.props.change("fullName", "");
                }}
                onSubmitEditing={handleSubmit(values => {
                  if (!blockAction) {
                    blockAction = true;
                    temshow();
                    setTimeout(() => {
                      searchAction(values);
                    }, 0);
                    setTimeout(() => {
                      scrollUp();
                    }, 0);
                    setTimeout(() => {
                      blockAction = false;
                    }, 700);
                  }
                })}
              />
            </Col>
          </Row>
          <Row style={styles.normalRow}>
            <Col style={styles.icon_col}>
              <Icon style={styles.icon} name="phone" />
            </Col>
            <Col style={[styles.border, styles.fieldForm]}>
              <Field
                name="phoneNumber"
                placeholder={I18n.t("mobile", {
                  locale: locale ? locale : "vi"
                })}
                component={InputField}
                onClear={() => {
                  this.props.change("phoneNumber", "");
                }}
                onFocus={() => {
                  this.props.change("phoneNumber", "");
                }}
                onSubmitEditing={handleSubmit(values => {
                  if (!blockAction) {
                    blockAction = true;
                    temshow();
                    setTimeout(() => {
                      searchAction(values);
                    }, 0);
                    setTimeout(() => {
                      scrollUp();
                    }, 0);
                    setTimeout(() => {
                      blockAction = false;
                    }, 700);
                  }
                })}
              />
            </Col>
          </Row>
        </Grid>
        <Button
          ref={ref => {
            this.btSearch = ref;
          }}
          style={styles.buttomSearch}
          full
          // disabled={isLoading}
          style={styles.buttomSearch}
          onPress={handleSubmit(values => {
            if (!blockAction && !isLoading) {
              blockAction = true;
              temshow();
              setTimeout(() => {
                searchAction(values);
              }, 0);
              setTimeout(() => {
                scrollUp();
              }, 0);
              setTimeout(() => {
                blockAction = false;
              }, 500);
            }
          })}
        >
          <Text>
            {I18n.t("search", {
              locale: locale ? locale : "vi"
            })}
          </Text>
        </Button>
      </Form>
    );
  }
}
FormSearch = reduxForm({
  form: "search"
  // enableReinitialize: true
})(FormSearch);
export default FormSearch;
