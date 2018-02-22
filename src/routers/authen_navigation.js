import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform, BackHandler, ToastAndroid } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';
import { AuthenNavigationContainer } from './authen_navigation_config';
import * as authenNavigationAction from '../authen/actions/authen_navigation_action';

class AuthenNavigation extends React.Component {
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
        const { authenNavigationAction } = this.props;
        const { authenNavigationReducer } = this.props;
        if (authenNavigationReducer.index > 0) {
            authenNavigationAction.pop();
            return true;
        }
        else if (authenNavigationReducer.index == 0) {
            return false
        }
    }

    render() {
        const { authenNavigationAction, authenNavigationReducer } = this.props;
        return (
            <AuthenNavigationContainer navigation={addNavigationHelpers({ authenNavigationAction, state: authenNavigationReducer })}/>
        );
    }
}
function mapStateToProps(state, props) {
    return {
        authenNavigationReducer: state.authenNavigationReducer,
    }
};
function mapToDispatch(dispatch) {
    return {
        authenNavigationAction: bindActionCreators(authenNavigationAction, dispatch),
    }
}

export default connect(mapStateToProps, mapToDispatch)(AuthenNavigation);