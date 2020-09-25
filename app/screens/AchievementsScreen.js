import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";

import colors from "../config/colors";
import AppText from "../components/AppText";
import { useNavigation } from "@react-navigation/native";
import BackArrBtn from "../components/BackArrBtn";

export default function ViewLogs() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      // blurRadius={2}
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <BackArrBtn
        style={styles.backArr}
        onPress={() => navigation.goBack()}
      ></BackArrBtn>

      <View style={styles.btnContainer}>
        <AppText style={styles.headingText}>Logs</AppText>
        {/* View past 7 days */}
        <AppText style={styles.textLabel}>Past 7 days</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>4.5 HRS</AppText>
        </View>
        {/* View past 30 days */}
        <AppText style={styles.textLabel}>Past 30 days</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>7.5 HRS</AppText>
        </View>
        {/* View lotus obtained */}
        <AppText style={styles.textLabel}>Lotus obtained</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>24</AppText>
        </View>
        {/* View current streak */}
        <AppText style={styles.textLabel}>Current streak</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>5</AppText>
        </View>
        {/* View longest Streak  */}
        <AppText style={styles.textLabel}>Longest streak</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>7</AppText>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backArr: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 30,
  },
  headingText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "300",
    textTransform: "uppercase",
    marginBottom: 30,
  },
  btn: {
    borderRadius: 5,
    backgroundColor: colors.black,
    paddingHorizontal: 40,
    paddingVertical: 7,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  textLabel: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "300",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    paddingVertical: 100,
    paddingBottom: "30%",
    justifyContent: "space-between",
  },
});
