import React from "react";
import { Text, Platform, StyleSheet } from "react-native";
import { useFonts, Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import { AppLoading } from "expo";

function AppText({ children, style }) {
  let [fontsLoaded] = useFonts({
    Comfortaa_400Regular,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <Text style={[styles.text, style]}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    // color: "tomato",
    ...Platform.select({
      ios: {
        fontSize: 20,
        fontFamily: "Avenir",
      },
      android: {
        fontSize: 18,
        fontFamily: "Comfortaa_400Regular",
      },
    }),
  },
});

export default AppText;
