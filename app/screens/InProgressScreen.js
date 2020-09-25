import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import CountDown from "react-native-countdown-component";
import { Easing } from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

import AppText from "../components/AppText";

export default function InProgressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [playbackInstance, setPlaybackInstance] = useState(null);

  const [currCount, setCurrCount] = useState(1);

  // on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    activateKeepAwake();
    // playSoundThrice();
    let i = 0;
    _loadNewPlaybackInstance();
    const interval = setInterval(() => {
      i++;
      if (i > 2) {
        clearInterval(interval);
      } else {
        _loadNewPlaybackInstance();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function _loadNewPlaybackInstance() {
    //Existed before, clear everything previously
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
      // playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null);
    }
    let source = require("../assets/sounds/gong_sound.wav");
    switch (route.params.sound) {
      case "gong":
        source = require("../assets/sounds/gong_sound.wav");
        break;
      case "bell":
        source = require("../assets/sounds/bell_sound.wav");
        break;
      case "bowl":
        source = require("../assets/sounds/singingbowl_sound.wav");
        break;
    }
    // NOTE THAT SETSTATE IS ASYNCHRONOUS - this.state is not immediately changed. use callback instead
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
    //  Save the response of sound in playbackInstance
    setPlaybackInstance(sound);

    sound.playAsync();
  }

  // End screen alerts
  const endEarly = () => {
    return Alert.alert(
      "Confirm choice",
      "Are you sure you want to end the session?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            if (playbackInstance != null) playbackInstance.unloadAsync();
            deactivateKeepAwake();
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const finishAlert = () => {
    _loadNewPlaybackInstance();
    const interval = setInterval(() => {
      i++;
      if (i > 2) {
        clearInterval(interval);
      } else {
        _loadNewPlaybackInstance();
      }
    }, 5000);

    return Alert.alert(
      "Congratulations!",
      "You have completed the session and obtained 1 lotus!",
      [
        {
          text: "Ok",
          onPress: () => {
            if (playbackInstance != null) playbackInstance.unloadAsync();
            deactivateKeepAwake();
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <AppText style={[styles.text, { marginBottom: 60 }]}>
        Take a deep breath
      </AppText>
      <View style={[styles.innerFrame, { marginBottom: 60 }]}>
        {/* https://www.npmjs.com/package/react-native-countdown-component */}
        <CountDown
          until={route.params.minute * 60}
          onFinish={() => finishAlert()}
          size={30}
          timeToShow={["M", "S"]}
          timeLabels={{}}
          digitStyle={{ backgroundColor: "white" }}
          onChange={() => {
            setCurrCount(currCount + 1);
            console.log(currCount);
            if (
              route.params.interval != "off" &&
              currCount % (Number(route.params.interval) * 60) == 0
            ) {
              console.log("*" + currCount);
              _loadNewPlaybackInstance();
            }
          }}
          showSeparator
        />
        <AnimatedCircularProgress
          easing={Easing.linear}
          duration={route.params.minute * 60 * 1000}
          size={200}
          width={10}
          fill={100}
          tintColor="white"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#00000090"
          style={styles.progressCircle}
          rotation={180}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => endEarly()}>
        <AppText style={styles.text}>End Session</AppText>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  progressCircle: {
    position: "absolute",
    height: 300,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  innerFrame: {
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },

  btn: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  text: {
    color: "dimgrey",
    textTransform: "uppercase",
    fontSize: 16,
  },
});
