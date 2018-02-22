import React, {PureComponent, Component } from "react";
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text,
  H3,
  H2,
  H1,
  Item,
  Thumbnail
} from "native-base";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Grid, Col, Row } from "react-native-easy-grid";
import styles from "./styles";
import User from "../User";
import * as AppConfig from "../../config/app_config";
const resolveAssetSource = require('resolveAssetSource');
const userAvar = require("../../resources/assets/user.jpg")
export default class extends PureComponent
 {
  static navigationOptions = {
    header: null
  };

  render() {
    const { key, userName, position, phone, avatarUrl } = this.props;
    return (
      <View key={key} style={styles.itemList}>
        <Thumbnail
          style={styles.thumbnail_avatar}
          source={avatarUrl ? {
            uri: `${AppConfig}${avatarUrl}`
          } : userAvar
          }
          ref={(thumbnail) => { this.thumbnail = thumbnail; }}
          onError={(e) => {
            this.thumbnail.setNativeProps({ src: [resolveAssetSource(userAvar)] })
          }}
        />
        <View style={styles.item}>
          <Item disabled style={[styles.name_center, styles.borderBottomNone]}>
            <H3 style={styles.textPadding}>{userName}</H3>
          </Item>
          <Item disabled style={[styles.itemPostion, styles.borderBottomNone]}>
            <Icon name="map-marker" style={styles.icon} />
            <Text>{position}</Text>
          </Item>
          <Item disabled style={[styles.itemPhone, styles.borderBottomNone]}>
            <Icon name="phone" style={styles.icon} />
            <Text>{phone}</Text>
          </Item>
        </View>
      </View>
    );
  }
}
