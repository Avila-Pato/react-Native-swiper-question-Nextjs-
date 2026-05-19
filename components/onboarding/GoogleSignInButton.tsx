import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSuccess: (user: any) => void;
};

const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_KEY_ANDROID ?? "";
const REVERSED_ANDROID_ID = ANDROID_CLIENT_ID.replace(
  ".apps.googleusercontent.com",
  ""
);

export const GoogleSignInButton = ({ onSuccess }: Props) => {
  const redirectUri = useMemo(
    () =>
      makeRedirectUri(
        Platform.OS === "android"
          ? {
              native: `com.googleusercontent.apps.${REVERSED_ANDROID_ID}:/oauth2redirect`,
            }
          : {}
      ),
    []
  );

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_WEB,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_IOS,
      androidClientId: ANDROID_CLIENT_ID,
      redirectUri,
    }
  );

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
      .catch((e) => console.log("Error Google auth:", e));
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
