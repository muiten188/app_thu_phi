import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import {
  Container, Item, Input, Header, Body, Content,
  Card, CardItem, Title, Button, Text, Icon,
  Thumbnail, CardSwiper, DeckSwiper,
  List, ListItem, CheckBox, Badge
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FieldsetLegend from '../../components/FieldSet'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const submit = values => {
  return sleep(1000).then(() => {
    // if (!['john', 'paul', 'george', 'ringo'].includes(values.username)) {
    //     throw new SubmissionError({
    //       username: 'User does not exist',
    //       _error: 'Login failed!'
    //     })
    //   } else if (values.password !== 'redux-form') {
    //     throw new SubmissionError({
    //       password: 'Wrong password',
    //       _error: 'Login failed!'
    //     })
    //   } else {
    // simulate server latency  
    alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
    //}
  })
}
const validate = values => {
  const error = {};
  error.email = '';
  error.name = '';
  var ema = values.email;
  var nm = values.name;
  if (values.email === undefined) {
    ema = '';
  }
  if (values.name === undefined) {
    nm = '';
  }
  if (ema.length < 8 && ema !== '') {
    error.email = 'too short';
  }
  if (!ema.includes('@') && ema !== '') {
    error.email = '@ not included';
  }

  if (nm.length > 8) {
    error.name = 'max 8 characters';
  }
  return error;
};
class SimpleForm extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.state = { email: "" }
  }
  renderInput({ input, label, type, meta: { touched, error, warning }, secureTextEntry }) {
    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (<Item style={{ margin: 10 }} error={hasError}>
      <Input {...input} secureTextEntry={secureTextEntry} />
      {hasError ? <Text>{error}</Text> : <Text />}
    </Item>)
  }

  render() {
    const { handleSubmit, reset } = this.props;
    var items = ['Simon Mignolet', 'Nathaniel Clyne', 'Dejan Lovren', 'Mama Sakho', 'Emre Can'];
    var data1 = {
      data: [
        { name: "Movies", header: true },
        { name: "Interstellar", header: false },
        { name: "Dark Knight", header: false },
        { name: "Pop", header: false },
        { name: "Pulp Fiction", header: false },
        { name: "Burning Train", header: false },
        { name: "Music", header: true },
        { name: "Adams", header: false },
        { name: "Nirvana", header: false },
        { name: "Amrit Maan", header: false },
        { name: "Oye Hoye", header: false },
        { name: "Eminem", header: false },
        { name: "Places", header: true },
        { name: "Jordan", header: false },
        { name: "Punjab", header: false },
        { name: "Ludhiana", header: false },
        { name: "Jamshedpur", header: false },
        { name: "India", header: false },
        { name: "People", header: true },
        { name: "Jazzy", header: false },
        { name: "Appie", header: false },
        { name: "Baby", header: false },
        { name: "Sunil", header: false },
        { name: "Arrow", header: false },
        { name: "Things", header: true },
        { name: "table", header: false },
        { name: "chair", header: false },
        { name: "fan", header: false },
        { name: "cup", header: false },
        { name: "cube", header: false }
      ],
      stickyHeaderIndices: []
    };
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <KeyboardAvoidingView behavior="padding" style={styles.form} keyboardVerticalOffset={84}>
          <Grid>
            <Col size={30} style={{
              backgroundColor: '#D954D7', height: 500
            }}>
              <List dataArray={items}
                renderRow={(item) =>
                  <ListItem>
                    <Text>{item}</Text>
                  </ListItem>
                }>
              </List>
            </Col>
            <Col size={70} style={{ backgroundColor: '#ffffff', height: 500 }}>
              <List>
                <ListItem itemDivider>
                  <Text>Goalkeeper</Text>
                </ListItem>
                <ListItem itemDivider>
                  <Text>Defenders</Text>
                </ListItem>

                <ListItem>
                  <Text>Dejan Lovren</Text>
                </ListItem>
              </List></Col>
          </Grid>
          <FieldsetLegend style={{ margin: 15 }} legend="Simple from with legend">
            <Header>
              <Body>
                <Title>Redux Form</Title>
              </Body>
            </Header>
            <Content padder style={{ flex: 1 }}>
              <Grid>
                <Col size={25} style={{ backgroundColor: '#D954D7', height: 200 }}></Col>
                <Col size={75} style={{ backgroundColor: '#D93735', height: 200 }}>
                    <FlatList
                      data={data1.data}
                      renderItem={({item}) => <View style={styles.item}>
                                                <Text>{item.name}</Text>
                                              </View>}
                      numColumns={1}
                    />

                </Col>
              </Grid>
              <Field name="email" component={this.renderInput} />
              <Field name="name" component={this.renderInput} />
              <Field placeholder="Mật khẩu hiện tại" name="cs" secureTextEntry={true} component={Input} />
              <Button style={{ margin: 10 }} block primary onPress={handleSubmit}>
                <Text>Submit</Text>
              </Button>

              <Input placeholder="Mật khẩu hiện tại" secureTextEntry={true} />
              <Input placeholder="Mật khẩu mới" secureTextEntry={true} />
              <Input placeholder="Nhập lại mật khẩu mới" secureTextEntry={true} />
              <Button><Text>Cập nhật</Text></Button>
              <Card>
                <CardItem>
                  <Icon name='logo-google' />
                  <Text>Google</Text>
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Thumbnail source={require('../../resources/assets/splash.png')} />
                  <Text>Instrumental Songs</Text>
                  <Text note>Guitar</Text>
                </CardItem>

                <CardItem>
                  <Image style={{ resizeMode: 'cover' }} source={require('../../resources/assets/splash.png')} />
                </CardItem>

                <CardItem>
                  <Icon name='ios-musical-notes' style={{ color: '#ED4A6A' }} />
                  <Text>Listen now</Text>
                </CardItem>
              </Card>
              <List>
                <ListItem>
                  <CheckBox name="c1" checked={true} />
                  <Text>Daily Stand Up</Text>
                </ListItem>
                <ListItem>
                  <CheckBox name="c" />
                  <Text>Discussion with Client</Text>
                </ListItem>
              </List>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                placeholder="Email/Số điện thoại1"
              />
              <Input placeholder="Email/Số điện thoại" />


              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <Input
                style={styles.input}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                ref={ref => { this._emailInput = ref }}
                placeholder="email@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={this._submit}
                blurOnSubmit={true}
              />
              <KeyboardAvoidingView>
                <Text style={styles.label}>Forgot password?</Text>
              </KeyboardAvoidingView>
              <View>
                <Button title="Sign Up" onPress={this._submit} />
                <Text style={styles.legal}>
                  Some important legal fine print here
                              </Text>
              </View>
            </Content>
          </FieldsetLegend>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    loginReducer: state.loginReducer,
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    paddingTop: 20,
    padding: 20,
    backgroundColor: '#336699',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    margin: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  item: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: 'blue',
  },
});


export default reduxForm({
  form: 'test',
  validate,
  onSubmit: submit
})(connect(mapStateToProps)(SimpleForm))