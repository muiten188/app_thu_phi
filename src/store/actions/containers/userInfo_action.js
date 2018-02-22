import * as types from "../../constants/action_types";
import * as AppConfig from "../../../config/app_config";
import { AsyncStorage } from "react-native";

export function _getUser(user) {
  return {
    type: types.USER_INFO,
    user: user
  };
}