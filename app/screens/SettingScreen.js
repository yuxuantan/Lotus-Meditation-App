import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Picker,
} from "react-native";
import MyBtn from "../components/MyBtn";
import MySmallBtn from "../components/MySmallBtn";
import BackArrBtn from "../components/BackArrBtn";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as WheelPicker from "react-native-picker-js";

// Just to test picker
import colors from "../config/colors";

export default function SettingScreen() {
  //to get id from params - const route = useRoute();
  const navigation = useNavigation();
  //initialize to 5 . Hooks to persist state in function
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [ambient, setAmbient] = useState("Forest");
  const [gongSound, setGongSound] = useState("Gong");
  const [gongInterval, setGongInterval] = useState("Off"); // on would sound the gong every 5 mins
  function _showDatePicker() {
    WheelPicker.init({
      pickerData: [1, 2, 3, 4],
      pickerFontColor: [255, 0, 0, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        console.log("date", pickedValue, pickedIndex);
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
        console.log("date", pickedValue, pickedIndex);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
        console.log("date", pickedValue, pickedIndex);
      },
    });
    WheelPicker.show();
  }
  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/forest-background.jpg")}
    >
      <View style={styles.btnContainer}>
        {/* to get id from params */}
        {/* <Text>{route.params.id}</Text> */}
        {/* SELECT Ambient */}
        <View style={[styles.btn, { backgroundColor: colors.secondary }]}>
          <Text style={styles.text}>Ambient: </Text>
          <Text style={styles.text}>{ambient}</Text>
          <Picker
            mode="dropdown"
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setAmbient(itemValue)}
          >
            <Picker.Item label="Forest" value="Forest" />
            <Picker.Item label="Mountain" value="Mountain" />
            <Picker.Item label="Waterfall" value="Waterfall" />
          </Picker>
        </View>
        {/* SELECT TIME */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.secondary }]}
          onPress={_showDatePicker()}
        ></TouchableOpacity>
        {/* SELECT GOng sound */}
        <View style={[styles.btn, { backgroundColor: colors.secondary }]}>
          <Text style={styles.text}>Gong sound: </Text>
          <Text style={styles.text}>{gongSound}</Text>
          <Picker
            mode="dropdown"
            selectedValue={gongSound}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setGongSound(itemValue)}
          >
            <Picker.Item label="Gong" value="Gong" />
            <Picker.Item label="Singing Bowl" value="Singing Bowl" />
            <Picker.Item label="Bell" value="Bell" />
          </Picker>
        </View>
        {/* SELECT Gong interval */}
        <View style={[styles.btn, { backgroundColor: colors.secondary }]}>
          <Text style={styles.text}>Gong Interval: </Text>
          <Text style={styles.text}>{gongInterval}</Text>
          <Picker
            mode="dropdown"
            selectedValue={gongInterval}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setGongInterval(itemValue)}
          >
            <Picker.Item label="Off" value="Off" />
            <Picker.Item label="On" value="On" />
          </Picker>
        </View>

        <MyBtn
          style={styles.lastBtn}
          title="Start"
          //Time in seconds
          onPress={() =>
            navigation.navigate("InProgress", {
              time: hour * 60 * 60 + minute * 60 + second,
              ambient: ambient,
              gongInterval: gongInterval,
              gongSound: gongSound,
            })
          }
        />
      </View>
      <BackArrBtn
        style={styles.backArr}
        onPress={() => navigation.goBack()}
      ></BackArrBtn>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // FOR picker
  btn: {
    width: "75%",
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "500",
    // position: "absolute",
  },
  picker: {
    height: "100%",
    width: "100%",
    color: "#FFF0",
    position: "absolute",
  },
  //
  background: {
    flex: 1,
  },
  btnContainer: {
    paddingVertical: 100,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastBtn: {
    marginTop: 20,
  },
  backArr: {
    position: "absolute",
    left: 40,
    bottom: 20,
  },
});
