import CustomTabBar from "@/components/tabBar/CustomTabBar";
import { Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Info, Layers } from "lucide-react-native";
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
              <Octicons name="home-fill" size={24} color="white" />
            ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tarjetas",
          tabBarIcon: ({ color, focused }) => (
            <Layers
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Info",
          tabBarIcon: ({ color, focused }) => (
            <Info
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
