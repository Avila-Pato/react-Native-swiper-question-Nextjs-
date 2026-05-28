import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins_400Regular.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins_500Medium.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins_600SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins_700Bold.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins_800ExtraBold.ttf"),
    "Playfair-Bold": require("@/assets/fonts/PlayfairDisplay_700Bold.ttf"),
    "Playfair-ExtraBold": require("@/assets/fonts/PlayfairDisplay_800ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="(onboarding)/career" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="(onboarding)/career-ramas" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="(onboarding)/personal" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="(onboarding)/signup" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="oauth2redirect" options={{ headerShown: false }} />
        <Stack.Screen name="(tab)" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="career-detail" options={{ headerShown: false, animation: "slide_from_bottom", presentation: "modal" }} />
        <Stack.Screen name="challenge-detail" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="role-test" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="role-result" options={{ headerShown: false, animation: "slide_from_right" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
