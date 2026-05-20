import { googleApi } from "@/lib/GoogleApi";
import { AntDesign } from "@expo/vector-icons";
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
  "",
);

export const GoogleSignInButton = ({ onSuccess }: Props) => {
  const redirectUri = useMemo(
    () =>
      makeRedirectUri(
        Platform.OS === "android"
          ? {
              native: `com.googleusercontent.apps.${REVERSED_ANDROID_ID}:/oauth2redirect`,
            }
          : {},
      ),
    [],
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_WEB,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_KEY_IOS,
    androidClientId: ANDROID_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type !== "success" || !response.authentication) return;
    const token = response.authentication.accessToken;
    googleApi
      .get("/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async ({ data: user }) => {
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
      activeOpacity={0.85}
    >
      <AntDesign name="google" size={16} color="#4285F4" />
      <Text style={styles.buttonText}>Continuar con Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#ffffff",
    width: "100%",
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#3c4043",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
