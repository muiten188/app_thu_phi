import Login from '../authen/containers/Login';
import {
    addNavigationHelpers,
    StackNavigator,
} from 'react-navigation';

const stackNavigatorConfiguration = {
    initialRouteName: 'Login',
    headerMode: 'screen'
}

export const AuthenNavigationContainer = StackNavigator({
    Login: { screen: Login }
}, stackNavigatorConfiguration)