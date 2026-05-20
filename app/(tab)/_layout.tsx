import CustomTabBar from "@/components/tabBar/CustomTabBar";
import { Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Layers, UserCircle } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar props={props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) =>
            !focused ? (
              <Octicons name="home" size={24} color={color} />
            ) : (
              <Octicons name="home-fill" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tarjetas",
          tabBarIcon: ({ color }) => (
            <Layers color={color} size={24} fill="transparent" />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <UserCircle size={24} color={color} fill="transparent" />
          ),
        }}
      />
    </Tabs>
  );
}
