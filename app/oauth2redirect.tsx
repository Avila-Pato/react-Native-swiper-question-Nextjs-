import * as WebBrowser from "expo-web-browser";
import { View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function OAuthRedirect() {
  return <View />;
}
