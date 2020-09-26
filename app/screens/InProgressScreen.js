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
import AsyncStorage from "@react-native-community/async-storage";

import AppText from "../components/AppText";

export default function InProgressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [currCount, setCurrCount] = useState(1);

  // number of lotus to be gained if complete
  const [achievements, setAchievements] = useState();

  function daysBetween(first, second) {
    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(
      second.getFullYear(),
      second.getMonth(),
      second.getDate()
    );

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
  }

  const dateToStr = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };
  const updateAchievements = async () => {
    // get today's date
    var date = new Date();

    try {
      // update curr streak in db

      const db_lastDate = await AsyncStorage.getItem("lastDate");
      const db_currentStreak = await AsyncStorage.getItem("currentStreak");
      let daysDiff = 0;
      // check for null - means first time, no lastDate, no current streak => curr streak = 1,
      if (db_lastDate == null || db_currentStreak == null) {
        await AsyncStorage.setItem("currentStreak", "1");
      }
      // NOT null, existed before
      else {
        daysDiff = daysBetween(new Date(db_lastDate), date);

        if (daysDiff == 1) {
          // if one day diff, increase streak
          await AsyncStorage.setItem(
            "currentStreak",
            (parseInt(db_currentStreak) + 1).toString()
          );
        } else if (daysDiff > 1) {
          // if more than one day diff, reset streak
          await AsyncStorage.setItem("currentStreak", "1");
        }
      }
      // * Note: if same day, dont increase streak (means do before already) - do nothing

      // update 30 day queue in db
      const db_historyQ = await AsyncStorage.getItem("historyQ");

      // if DONT exist => push this in

      if (db_historyQ == null) {
        await AsyncStorage.setItem(
          "historyQ",
          [route.params.minute].toString()
        );
      }
      // if exist - parse, add, and put back IF less than 30
      else {
        let histQArr = db_historyQ.split(",");

        // check how many days since last & dequeue by number of days
        if (daysDiff > 0) {
          // diff more than 1 day, push in x-1 times of 0, push in 1 time of minutes, dequeue till 30
          for (let i = 0; i < daysDiff - 1; i++) {
            histQArr.push(0);
          }
          histQArr.push(route.params.minute);
        } else if (daysDiff == 0) {
          // diff 0 day, add time to last entry without dequeing or pushing
          let newVal =
            parseInt(histQArr[histQArr.length - 1]) + route.params.minute;
          histQArr[histQArr.length - 1] = newVal;
        }

        // dequeue till length 30 - since only keep 30 days record
        while (histQArr.length > 30) {
          histQArr.shift();
        }

        // console.log(histQArr.toString());

        // update db
        await AsyncStorage.setItem("historyQ", histQArr.toString());
      }
    } catch (e) {
      alert(e);
    }

    // update lotus in db
    try {
      const db_numLotus = await AsyncStorage.getItem("numLotus");
      if (db_numLotus !== null) {
        // exists => increment
        await AsyncStorage.setItem(
          "numLotus",
          (parseInt(db_numLotus) + achievements.numLotus).toString()
        );
      } else {
        // dont exist => set new item
        await AsyncStorage.setItem(
          "numLotus",
          achievements.numLotus.toString()
        );
      }
    } catch (e) {
      alert(e);
    }

    // update last date in db
    // * note: last code to run! check date before updating it in db
    try {
      await AsyncStorage.setItem("lastDate", dateToStr(date));
    } catch (e) {
      alert(e);
    }
  };

  // calculate lotus to be obtained on finish
  const calculateLotus = () => {
    switch (route.params.minute) {
      case 15:
        setAchievements({ numLotus: 1 });
        break;

      case 30:
        setAchievements({ numLotus: 2 });
        break;

      case 45:
        setAchievements({ numLotus: 3 });
        break;

      case 60:
        setAchievements({ numLotus: 4 });
        break;
    }
  };

  // On mount (execute once)
  useEffect(() => {
    // calculate # lotus to be obtained
    calculateLotus();

    // set audio settings
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });

    // Keep screen awake
    activateKeepAwake();

    // play sound 3x to signal start
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

    // on exit, stop playing sounds
    return () => clearInterval(interval);
  }, []);

  // function to play sound
  const _loadNewPlaybackInstance = async () => {
    // if existed before, clear everything previously
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
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
  };

  // Function when end early is pressed
  const endEarly = () => {
    return Alert.alert(
      "Confirm choice",
      "Are you sure you want to end the session?",
      [
        {
          text: "No",
          // onPress: () => console.log("Cancel Pressed"),
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

  // Function when finished session
  const finishAlert = () => {
    // update db
    updateAchievements();

    // play sound 3x to signal end session
    _loadNewPlaybackInstance();
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > 2) {
        clearInterval(interval);
      } else {
        _loadNewPlaybackInstance();
      }
    }, 5000);

    // show alert and populate with # lotus
    return Alert.alert(
      "Congratulations!",
      "You have completed the session and obtained " +
        achievements.numLotus +
        " lotus!",
      [
        {
          text: "Ok",
          onPress: () => {
            if (playbackInstance != null) playbackInstance.unloadAsync();
            clearInterval(interval);
            deactivateKeepAwake();
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  // ui
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <AppText style={[styles.text, { marginBottom: 60 }]}>
        Take a deep breath
      </AppText>
      <View style={[styles.innerFrame, { marginBottom: 60 }]}>
        <CountDown
          until={route.params.minute * 60}
          onFinish={() => finishAlert()}
          size={30}
          timeToShow={["M", "S"]}
          timeLabels={{}}
          digitStyle={{ backgroundColor: "white" }}
          onChange={() => {
            setCurrCount(currCount + 1);
            if (
              route.params.interval != "off" &&
              currCount % (Number(route.params.interval) * 60) == 0
            ) {
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
          backgroundColor="#00000090"
          style={styles.progressCircle}
          rotation={180}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => endEarly()}>
        <AppText style={styles.text}>End Session</AppText>
      </TouchableOpacity>

      {/* FOR TESTING ONLY  - simulate finish*/}
      {/* <TouchableOpacity style={styles.btn} onPress={() => finishAlert()}>
        <AppText style={styles.text}>Simulate Finish</AppText>
      </TouchableOpacity> */}
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
