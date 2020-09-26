import React, { useState, useEffect } from "react";

import { StyleSheet, View, ImageBackground } from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import BackArrBtn from "../components/BackArrBtn";
import colors from "../config/colors";
import AppText from "../components/AppText";

export default function ViewLogs() {
  const navigation = useNavigation();
  const [numLotus, setNumLotus] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [pastSeven, setPastSeven] = useState(0);
  const [pastThirty, setPastThirty] = useState(0);

  useEffect(() => {
    getData();
  }, [currentStreak, longestStreak]);

  const daysBetween = (first, second) => {
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
  };

  // retrieve from db and populate ui
  const getData = async () => {
    // calculate and display streaks from db data
    try {
      var today = new Date();
      const db_lastDate = await AsyncStorage.getItem("lastDate");

      // compare db last date and curr date
      const daysDiff = daysBetween(new Date(db_lastDate), today);

      // update streak on db
      if (daysDiff > 1) {
        // if more than one day away - reset current streak
        await AsyncStorage.setItem("currentStreak", "0");
      }
      // NOTE: IF same day - already increased streak - do nothing
      //       IF one day different - do nothing (still got chance to cont streak)

      // get from db current and longest streaks
      const db_currentStreak = await AsyncStorage.getItem("currentStreak");
      const db_longestStreak = await AsyncStorage.getItem("longestStreak");

      // if current streak exists - NOT first time =>  set ui
      if (db_currentStreak != null) await setCurrentStreak(db_currentStreak);

      //   IF longest streak DONT exist OR
      //      currStreak bigger than longest streak
      //        => update db and UI,longest = curr
      if (
        db_longestStreak == null ||
        currentStreak > parseInt(db_longestStreak)
      ) {
        if (db_currentStreak != null) {
          await AsyncStorage.setItem("longestStreak", db_currentStreak);
          setLongestStreak(db_currentStreak);
        }
      }
      // else dont update db, - display with db_longest
      // Not null, AND current streak doesnt exceed longest streak
      else setLongestStreak(parseInt(db_longestStreak));
    } catch (e) {
      alert(e);
    }

    // display lotus from DB
    try {
      const value = await AsyncStorage.getItem("numLotus");
      if (value !== null) {
        // value previously stored
        setNumLotus(value);
      }
    } catch (e) {
      // error reading value
      alert(e);
    }

    // retrieve historyQ from db and display
    try {
      const arrString = await AsyncStorage.getItem("historyQ");
      const arr = arrString.split(",");

      let sevenDays = 0;
      let thirtyDays = 0;
      for (let i = 0; i < arr.length; i++) {
        // for last 7, separate list
        if (i > arr.length - 7) {
          sevenDays += parseInt(arr[i]);
        }
        thirtyDays += parseInt(arr[i]);
      }
      // console.log(sevenDays, thirtyDays);
      setPastSeven(sevenDays);
      setPastThirty(thirtyDays);
    } catch (e) {}
  };

  return (
    <ImageBackground
      // blurRadius={2}
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      {/* <BackArrBtn
        style={styles.backArr}
        onPress={() => navigation.goBack()}
      ></BackArrBtn> */}

      <View style={styles.btnContainer}>
        <AppText style={styles.headingText}>Logs</AppText>
        {/* View past 7 days */}
        <AppText style={styles.textLabel}>Past 7 days (Mins)</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>{pastSeven}</AppText>
        </View>
        {/* View past 30 days */}
        <AppText style={styles.textLabel}>Past 30 days (Mins)</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>{pastThirty}</AppText>
        </View>
        {/* View lotus obtained */}
        <AppText style={styles.textLabel}>Lotus obtained</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>{numLotus}</AppText>
        </View>
        {/* View current streak */}
        <AppText style={styles.textLabel}>Current streak</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>{currentStreak}</AppText>
        </View>
        {/* View longest Streak  */}
        <AppText style={styles.textLabel}>Longest streak</AppText>
        <View style={styles.btn}>
          <AppText style={styles.text}>{longestStreak}</AppText>
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
    width: 150,
  },
});
