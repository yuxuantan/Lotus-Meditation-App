import React from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import MyBtn from "../components/MyBtn";
import MySmallBtn from "../components/MySmallBtn";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/forest-background.jpg")}
    >
      <MyBtn
        title="Start Session"
        // to pass params to navigation
        // onPress={() => navigation.navigate("Setting", { id: 10 })}
        onPress={() => navigation.navigate("Setting")}
      />

      <MySmallBtn
        style={styles.premiumBtn}
        title="Premium"
        onPress={() => console.log("s btn pressed")}
      />
      <MySmallBtn
        style={styles.achievementBtn}
        title="Achievements"
        onPress={() => navigation.navigate("Achievements")}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumBtn: {
    bottom: 40,
    left: 30,
    position: "absolute",
    // backgroundColor: "green",
  },
  achievementBtn: {
    bottom: 40,
    right: 30,
    position: "absolute",
  },
});
