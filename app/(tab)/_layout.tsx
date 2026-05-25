import CustomTabBar from "@/components/tabBar/CustomTabBar";
import { Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Target, Trophy, UserCircle, Users } from "lucide-react-native";
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
          title: "Retos",
          tabBarIcon: ({ color }) => (
            <Trophy color={color} size={24} fill="transparent" />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Mi Rol",
          tabBarIcon: ({ color }) => <Target size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="comunidad"
        options={{
          title: "Comunidad",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
