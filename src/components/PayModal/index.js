import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  Item,
  Footer,
  Left,
  Right,
  Content,
  H1,
  H3
} from "native-base";
import styles from "./styles";
import Modal from "react-native-modal";

export default class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, onClose, transactionCode, onPay } = this.props;
    return (
      <Modal isVisible={show} style={styles.modal}>
        <View style={styles.modalContainer}>
          <Content>
            <View style={styles.modalContent}>
              <H3 style={[styles.item_content, styles.textPadding]}>
                Mã giao dịch
              </H3>
              <H1
                style={[
                  styles.item_content,
                  styles.codeText,
                  styles.textPadding
                ]}
              >
                {transactionCode}
              </H1>
              <Text style={[styles.item_content, styles.textSize]}>
                Thanh toán đã được thực hiện Cảm ơn sự hợp tác của quý khách
              </Text>
            </View>
          </Content>
          <Footer style={styles.Footer}>
            <Item style={styles.border_bottomNone}>
              <Button
                onPress={onClose}
                style={[styles.buttonOk, styles.button_margin]}
              >
                <Text style={[styles.textSize, styles.textCancel]}>
                  Quay lại
                </Text>
              </Button>
              <Button onPress={onPay} style={styles.buttonCancel}>
                <Text style={[styles.textSize, styles.textOk]}>
                  In biên lai
                </Text>
              </Button>
            </Item>
          </Footer>
        </View>
      </Modal>
    );
  }
}
