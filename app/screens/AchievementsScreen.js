import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";

import MyBtn from "../components/MyBtn";
import MySmallBtn from "../components/MySmallBtn";
import colors from "../config/colors";
import BackArrBtn from "../components/BackArrBtn";
import AppText from "../components/AppText";
import { useNavigation } from "@react-navigation/native";

export default function ViewLogs() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/forest-background.jpg")}
    >
      {/* Replace the logs sheet bg with a nicer image */}
      <View style={styles.logsBg}>
        <AppText style={styles.header}>Achievements</AppText>
        <AppText>Past 7 days: 4.5hrs</AppText>
        <AppText>Past 30 days: 20.5 hrs</AppText>
        <AppText>#lotus obtained: 24</AppText>
        <AppText>Current Streak: 5</AppText>
        <AppText>Longest Streak: 7</AppText>
      </View>

      <BackArrBtn
        style={styles.backArr}
        onPress={() => navigation.goBack()}
      ></BackArrBtn>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logsBg: {
    width: 300,
    height: 600,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  backArr: {
    position: "absolute",
    left: 40,
    bottom: 20,
  },
  header: {
    fontSize: 24,
    textDecorationLine: "underline",
    fontStyle: "italic",
    marginVertical: 20,
  },
});
