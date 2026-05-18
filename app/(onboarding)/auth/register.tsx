import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSuccess: (user: any) => void;
};

export const GoogleSignInButton = ({ onSuccess }: Props) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_WEB,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_ANDROID,
  });

  useEffect(() => {
    if (response?.type !== "success" || !response.authentication) return;
    const token = response.authentication.accessToken;
    fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(async (user) => {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        onSuccess(user);
      })
      .catch((e) => console.log("Error Google auth: ", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <TouchableOpacity
      style={[styles.googleButton, !request && styles.disabledButton]}
      disabled={!request}
      onPress={() => promptAsync()}
      activeOpacity={0.82}
    >
      <Text style={styles.buttonText}>Continuar con Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#1F2937",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#34D59A",
    shadowColor: "#34D59A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: "#374151",
  },
  buttonText: {
    color: "#34D59A",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
