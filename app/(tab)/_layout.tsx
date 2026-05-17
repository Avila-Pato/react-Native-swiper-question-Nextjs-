import CustomTabBar from "@/components/tabBar/CustomTabBar";
import { Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Info, Star } from "lucide-react-native";
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
          title: "Home",
          tabBarIcon: ({ color, size, focused }) =>
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
          title: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <Star
              color={color}
              size={26}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Info",
          tabBarIcon: ({ color, size, focused }) => (
            <Info
              size={26}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
