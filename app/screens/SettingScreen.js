import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import ModalDropdown from "react-native-modal-dropdown";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";

import colors from "../config/colors";
import AppText from "../components/AppText";

export default function SettingScreen() {
  //to get id from params - const route = useRoute();
  const navigation = useNavigation();
  const [ambient, setAmbient] = useState("forest");
  const [minute, setMinute] = useState(15);
  const [sound, setSound] = useState("gong");
  const [interval, setInterval] = useState("off"); // on would sound the gong every 5 mins
  // const [prepTime, setPrepTime] = useState("off"); // on would sound the gong every 5 mins
  // const [ambientIsPlaying, setAmbientIsPlaying] = useState(false);
  // const [soundIsPlaying, setSoundIsPlaying] = useState(false);

  const [playbackInstance, setPlaybackInstance] = useState(null);

  // On mount (execute once)
  useEffect(() => {
    // set audio settings
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    return () => {
      if (playbackInstance != null) {
        playbackInstance.unloadAsync();
        setPlaybackInstance(null);
        // return true;
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (playbackInstance != null) {
          playbackInstance.unloadAsync();
          setPlaybackInstance(null);
          // return true;
        }
        // else {
        return false;
        // }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [playbackInstance])
  );

  // function to play sound
  const _loadNewPlaybackInstance = async (s) => {
    // if existed before, clear everything previously, stop music
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
      setPlaybackInstance(null);
    }
    let source = null;
    switch (s) {
      case "gong":
        source = require("../assets/sounds/gong_sound.wav");
        break;
      case "bell":
        source = require("../assets/sounds/bell_sound.wav");
        break;
      case "bowl":
        source = require("../assets/sounds/singingbowl_sound.wav");
        break;
      case "forest":
        source = require("../assets/sounds/forest_ambient.mp3");
        break;
      case "river":
        source = require("../assets/sounds/river_ambient.mp3");
        break;
      case "city":
        source = require("../assets/sounds/city_ambient.mp3");
        break;
      case "space":
        source = require("../assets/sounds/space_ambient.mp3");
        break;
      case "rain":
        source = require("../assets/sounds/rain_ambient.mp3");
        break;
    }
    if (source != null) {
      const initialStatus = {
        shouldPlay: true,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
      };
      const { sound, status } = await Audio.Sound.createAsync(
        source,
        initialStatus
      );
      //  Save the object in state hook
      setPlaybackInstance(sound);

      sound.playAsync();

      // Stop playing after 5 seconds preview
      // sound.unloadAsync();
      // setTimeout(() => {
      //   sound.unloadAsync();
      //   setPlaybackInstance(null);
      // }, 5000);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("minute", "" + minute);
      await AsyncStorage.setItem("sound", "" + sound);
      await AsyncStorage.setItem("interval", "" + interval);
      // await AsyncStorage.setItem("prepTime", "" + prepTime);
      await AsyncStorage.setItem("ambient", "" + ambient);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  const getData = async () => {
    try {
      const value1 = await AsyncStorage.getItem("minute");
      const value2 = await AsyncStorage.getItem("sound");
      const value3 = await AsyncStorage.getItem("interval");
      const value4 = await AsyncStorage.getItem("prepTime");
      const value5 = await AsyncStorage.getItem("ambient");

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
      if (value4 !== null) {
        setPrepTime(value4);
      }
      if (value5 !== null) {
        setAmbient(value5);
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
        <View style={{ flexDirection: "row" }}>
          <ModalDropdown
            style={styles.btn}
            dropdownStyle={[styles.option, { height: 253 }]}
            dropdownTextStyle={styles.optionText}
            options={["forest", "river", "city", "space", "rain", "off"]}
            onSelect={(idx, value) => setAmbient(value)}
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

              <AppText style={styles.text}>{ambient}</AppText>
            </View>
          </ModalDropdown>
          {/* SOUND */}
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: colors.black,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: -50,
            }}
            onPress={() => {
              // -- Get current status
              // playbackInstance.getStatusAsync();

              //  -- WHENEVER CALL TO API COMPLETES
              // playbackInstance.setOnPlaybackStatusUpdate();
              _loadNewPlaybackInstance(ambient);
            }}
          >
            <AntDesign name="sound" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* SELECT GOng sound */}
        <AppText style={styles.textLabel}>Sound</AppText>
        <View style={{ flexDirection: "row" }}>
          <ModalDropdown
            style={styles.btn}
            dropdownStyle={[styles.option, { height: 168 }]}
            dropdownTextStyle={styles.optionText}
            options={["gong", "bell", "bowl", "off"]}
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

          {/* SOUND */}
          <TouchableOpacity
            style={{
              borderRadius: 5,
              backgroundColor: colors.black,
              width: 40,
              height: 40,
              // marginBottom: 40, //  change this when more btns
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: -50,
            }}
            onPress={() => _loadNewPlaybackInstance(sound)}
          >
            <AntDesign name="sound" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
        {/* SELECT Gong interval */}
        <AppText style={styles.textLabel}>Sound Interval (mins)</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 128 }]}
          dropdownTextStyle={styles.optionText}
          options={[5, 15, "off"]}
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

        {/* SELECT prep time */}
        {/* <AppText style={styles.textLabel}>Prep time (secs)</AppText>
        <ModalDropdown
          style={styles.btn}
          dropdownStyle={[styles.option, { height: 170 }]}
          dropdownTextStyle={styles.optionText}
          options={[10, 30, 60, "off"]}
          onSelect={(idx, value) => setPrepTime(value)}
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
            <AppText style={styles.text}>{prepTime}</AppText>
          </View>
        </ModalDropdown> */}

        {/* Start btn */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            saveData();
            if (playbackInstance != null) playbackInstance.unloadAsync();
            navigation.navigate("InProgress", {
              minute: minute,
              sound: sound,
              interval: interval,
              ambient: ambient,
              // prepTime: prepTime,
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
