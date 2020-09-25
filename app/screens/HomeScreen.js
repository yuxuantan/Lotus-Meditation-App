import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppText from "../components/AppText";
import colors from "../config/colors";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ marginBottom: 40 }}
      ></Image>

      <TouchableOpacity
        // to pass params to navigation
        // onPress={() => navigation.navigate("Setting", { id: 10 })}
        style={styles.startBtn}
        onPress={() => navigation.navigate("Setting")}
      >
        <AppText style={styles.startText}>Start</AppText>
      </TouchableOpacity>

      <AppText style={[styles.text, { marginBottom: 3 }]}>
        Your Meditation
      </AppText>
      <AppText style={[styles.text, { marginBottom: 90 }]}>
        Journey Today
      </AppText>

      <TouchableOpacity style={[styles.btn, { marginBottom: 25 }]}>
        <AppText style={styles.text}>Premium</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Achievements")}
      >
        <AppText style={styles.text}>Achievements</AppText>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "dimgrey",
    textTransform: "uppercase",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
  },
  startBtn: {
    backgroundColor: "black",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 40,
    marginBottom: 15,
  },
  startText: {
    color: colors.white,
    textTransform: "uppercase",
    fontSize: 16,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
