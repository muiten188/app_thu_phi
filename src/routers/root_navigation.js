import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform, BackHandler, ToastAndroid } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';
import { RootNavigationContainer } from './root_navigation_config';
import * as navigationAction from '../store/actions/root_navigation/root_navigation_actions';

class RootNavigation extends React.Component {
    //Life cycle component
    constructor(props) {
        super(props);
        this._handleBackAction = this.handleBackAction.bind(this);
    }

    componentDidMount() {
        if (Platform.OS == "android") {
            BackHandler.addEventListener('backPress', this._handleBackAction);
        }
    }

    componentWillUnmount() {
        if (Platform.OS == "android") {
            BackHandler.removeEventListener('backPress', this._handleBackAction);
        }
    }
    //component function
    handleBackAction() {
        if (Platform.OS == "android") {
            ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        }
        const { navigationAction } = this.props;
        const { navigationReducer } = this.props;
        if (navigationReducer.index > 0) {
            navigationAction.pop();
            return true;
        }
        else if (navigationReducer.index == 0) {
            return false
        }
    }

    render() {
        const { navigationAction, navigationReducer } = this.props;
        return (
            <RootNavigationContainer navigation={addNavigationHelpers({ dispatch:navigationAction, state: navigationReducer })}/>
        );
    }
}
function mapStateToProps(state, props) {
    return {
        navigationReducer: state.navigationReducer,
    }
};
function mapToDispatch(dispatch) {
    return {
        navigationAction: bindActionCreators(navigationAction, dispatch),
    }
}

export default connect(mapStateToProps, mapToDispatch)(RootNavigation);