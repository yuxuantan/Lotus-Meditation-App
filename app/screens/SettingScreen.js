import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import ModalDropdown from "react-native-modal-dropdown";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "../components/AppText";

export default function SettingScreen() {
  //to get id from params - const route = useRoute();
  const navigation = useNavigation();
  const [ambient, setAmbient] = useState("forest");
  const [minute, setMinute] = useState(15);
  const [sound, setSound] = useState("gong");
  const [interval, setInterval] = useState("off"); // on would sound the gong every 5 mins

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("minute", "" + minute);
      await AsyncStorage.setItem("sound", "" + sound);
      await AsyncStorage.setItem("interval", "" + interval);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  const getData = async () => {
    try {
      const value1 = await AsyncStorage.getItem("minute");
      const value2 = await AsyncStorage.getItem("sound");
      const value3 = await AsyncStorage.getItem("interval");

      if (value1 !== null) {
        // value previously stored
        setMinute(parseInt(value1));
      }
      if (value2 !== null) {
        setSound(value2);
      }
      if (value3 !== null) {
        setInterval(value3);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <View style={styles.btnContainer}>
        {/* SELECT Ambient -- FUTURE FEATURE */}
        <AppText style={styles.textLabel}>Ambient</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 168 }]}
          dropdownTextStyle={styles.optionText}
          options={["forest", "river", "city", "space"]}
          onSelect={(idx, value) => setAmbient(value)}
          dropdownTextHighlightStyle={{ fontWeight: "400" }}
          showsVerticalScrollIndicator={false}
          disabled={true} //  to remove this once ready
        >
          <View
            style={{
              width: 150,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Ionicons
              name="ios-arrow-down"
              size={18}
              style={{ position: "absolute", right: 10, color: "white" }}
              color="black"
            /> */}
            {/*  To switch this for arrow once ready */}
            <AntDesign
              name="lock"
              size={18}
              style={{ position: "absolute", right: 5, color: "white" }}
              color="black"
            />
            <AppText style={styles.text}>{ambient}</AppText>
          </View>
        </ModalDropdown>

        {/* SELECT TIME */}
        <AppText style={styles.textLabel}>Total Time (mins)</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 168 }]}
          dropdownTextStyle={styles.optionText}
          options={[15, 30, 45, 60]}
          onSelect={(idx, value) => setMinute(value)}
          dropdownTextHighlightStyle={{ fontWeight: "400" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: 150,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="ios-arrow-down"
              size={18}
              style={{ position: "absolute", right: 10, color: "white" }}
              color="black"
            />
            <AppText style={styles.text}>{minute}:00</AppText>
          </View>
        </ModalDropdown>
        {/* SELECT GOng sound */}
        <AppText style={styles.textLabel}>Sound</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 126 }]}
          dropdownTextStyle={styles.optionText}
          options={["gong", "bell", "bowl"]}
          onSelect={(idx, value) => setSound(value)}
          dropdownTextHighlightStyle={{ fontWeight: "400" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: 150,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="ios-arrow-down"
              size={18}
              style={{ position: "absolute", right: 10, color: "white" }}
              color="black"
            />
            <AppText style={styles.text}>{sound}</AppText>
          </View>
        </ModalDropdown>
        {/* SELECT Gong interval */}
        <AppText style={styles.textLabel}>Interval Sound (mins)</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 210 }]}
          dropdownTextStyle={styles.optionText}
          options={[1, 5, 10, 15, "off"]}
          onSelect={(idx, value) => setInterval(value)}
          dropdownTextHighlightStyle={{ fontWeight: "400" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: 150,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="ios-arrow-down"
              size={18}
              style={{ position: "absolute", right: 10, color: "white" }}
              color="black"
            />
            <AppText style={styles.text}>{interval}</AppText>
          </View>
        </ModalDropdown>

        {/* Start btn */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            saveData();
            navigation.navigate("InProgress", {
              minute: minute,
              sound: sound,
              interval: interval,
            });
          }}
        >
          <AppText style={styles.startText}>Start</AppText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  startBtn: {
    borderRadius: 30,
    backgroundColor: colors.white,
    marginHorizontal: 18,
    paddingVertical: 12,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    borderRadius: 5,
    backgroundColor: colors.black,
    width: 150,
    height: 40,
    marginBottom: 40, //  change this when more btns
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  startText: {
    color: "grey",
    fontSize: 18,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  textLabel: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "300",
    textTransform: "uppercase",
  },

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  option: {
    marginTop: -20,
    width: 150,
    borderRadius: 5,
    // justifyContent: "center",
    // alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    width: 150,
    fontWeight: "300",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
