import { SPACING, TAB_ITEM_SIZE } from "@/constants/constants";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabbarItem from "./TabbarItem";

type Props = { props: BottomTabBarProps };

const ACTIVE_COLOR = "#111827";
const INACTIVE_COLOR = "rgba(255,255,255,0.45)";
const BAR_HEIGHT = TAB_ITEM_SIZE + SPACING * 1.5;

const CustomTabBar = ({ props }: Props) => {
  const { state, descriptors, navigation } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom, height: BAR_HEIGHT + bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const label = options.title ?? route.name;

        return (
          <TabbarItem
            key={route.key}
            onPress={onPress}
            isFocused={isFocused}
            label={label}
            tabBarIcon={options.tabBarIcon?.({
              focused: isFocused,
              size: 22,
              color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
            })}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: SPACING * 2,
    backgroundColor: "#111827",
  },
});
