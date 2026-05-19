import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
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
      </Stack>
    </GestureHandlerRootView>
  );
}
