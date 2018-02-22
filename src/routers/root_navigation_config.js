import UserInfo from "../containers/UserInfo";
import Search from "../containers/Search";
import BillList from "../containers/BillList";
import BillDetail from "../containers/BillDetail";
import History from "../containers/History";
import HistoryDetail from '../containers/HistoryDetail';
import SimpleFrom from "../containers/SimpleForm";

import { addNavigationHelpers, StackNavigator } from "react-navigation";

const stackNavigatorConfiguration = {
  initialRouteName: "UserInfo"
};

export const RootNavigationContainer = StackNavigator(
  {
    UserInfo: { screen: UserInfo },
    SimpleFrom: {
      screen: SimpleFrom,
      navigationOptions: {
        title: "Simple Form"
      }
    },
    Search: { screen: Search },
    BillList: { screen: BillList },
    BillDetail: { screen: BillDetail },
    History: { screen: History },
    HistoryDetail: { screen: HistoryDetail },
  },
  stackNavigatorConfiguration
);
