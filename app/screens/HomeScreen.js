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
// import AsyncStorage from "@react-native-community/async-storage";
import { AntDesign } from "@expo/vector-icons";

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

      {/* To switch to touchable opacity */}
      <TouchableOpacity
        style={[styles.btn, { marginBottom: 25, paddingHorizontal: 30 }]}
        onPress={() => alert("This feature is not ready.")}
      >
        <AppText style={styles.text}>Premium</AppText>
        <AntDesign
          name="lock"
          size={18}
          style={{ position: "absolute", right: 8, top: 9, color: "black" }}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Achievements")}
      >
        <AppText style={styles.text}>Achievements</AppText>
      </TouchableOpacity>

      {/* FOR TESTING - reset data */}
      {/* <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          var date = new Date();
          console.log("today:", date);
          // date.setDate(date.getDate() - 1);
          // console.log("new date:", date);
          try {
            AsyncStorage.clear();

            // await AsyncStorage.setItem("currentStreak", "3");
            // await AsyncStorage.setItem("longestStreak", "5");
            // convert date
            // var d = new Date(date),
            //   month = "" + (d.getMonth() + 1),
            //   day = "" + (d.getDate() - 1),
            //   year = d.getFullYear();

            // if (month.length < 2) month = "0" + month;
            // if (day.length < 2) day = "0" + day;

            // var dateStr = [year, month, day].join("-");

            // AsyncStorage.setItem("lastDate", dateStr);

            alert("reset success");
            // console.log("stored:", await AsyncStorage.getItem("lastDate"));
          } catch (e) {
            alert(e);
          }
        }}
      >
        <AppText style={styles.text}>RESET DATA AND SET LAST DATE</AppText>
      </TouchableOpacity> */}
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
