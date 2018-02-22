import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as action_types from '../../store/constants/action_types';
import { AuthenNavigationContainer } from '../../routers/authen_navigation_config';
const loginAction = AuthenNavigationContainer.router.getActionForPathAndParams('Login');
const initialNavState = AuthenNavigationContainer.router.getStateForAction(loginAction);

function authenNavigationReducer(state = initialNavState || {}, action = {}) {
    let nextState;
    switch (action.type) {
        case action_types.PUSH_ROUTE:
            switch (action.route.id) {
                case ("Login"):
                    nextState = AuthenNavigationContainer.router.getStateForAction(
                        NavigationActions.navigate({
                            routeName: action.route.id,
                            params: { oFilmServer: action.route.oFilmServer },//param
                            action: NavigationActions.navigate({ routeName: action.route.id })
                        }),
                        state);
                    break;
                default:
                    nextState = AuthenNavigationContainer.router.getStateForAction(
                        NavigationActions.navigate({ routeName: action.route.id }),
                        state);
                    break;
            }
            break;
        case action_types.POP_ROUTE:
            nextState = AuthenNavigationContainer.router.getStateForAction(
                NavigationActions.back(),
                state
            );
            break;
        default:
            nextState = AuthenNavigationContainer.router.getStateForAction(action, state);
            break;
    }

    return nextState || state;
}
export default authenNavigationReducer;