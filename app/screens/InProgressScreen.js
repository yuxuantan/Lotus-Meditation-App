import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyBtn from "../components/MyBtn";
import MySmallBtn from "../components/MySmallBtn";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import CountDown from "react-native-countdown-component";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Easing } from "react-native-reanimated";
import { Audio } from "expo-av";

// # of times looped
// const N = 2;

export default class InProgressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundImg: require("../assets/waterfall-background.jpg"),
      // sound: require("../assets/sounds/gong_sound.wav"),
    };
    this.playbackInstance = null;
  }
  componentDidMount() {
    //Image-ambient
    switch (this.props.route.params.ambient) {
      case "Waterfall":
        this.setState({
          backgroundImg: require("../assets/waterfall-background.jpg"),
        });
        break;
      case "Mountain":
        this.setState({
          backgroundImg: require("../assets/mountain-background.jpg"),
        });
        break;
      case "Forest":
        this.setState({
          backgroundImg: require("../assets/forest-background.jpg"),
        });
        break;
    }
    //Audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    //  This function will be called
    this._loadNewPlaybackInstance();
  }
  componentWillUnmount() {
    this.playbackInstance.unloadAsync();
    //  Check Your Console To verify that the above line is working
    console.log("unmount");
  }

  // method to update state and stop looping when reach N
  _onPlaybackStatusUpdate = (playbackStatus) => {
    console.log(this.state.numberOfLoops, this.state.targetNumLoops);
    if (playbackStatus.didJustFinish) {
      console.log("playback finish");
      if (this.state.numberOfLoops == this.state.targetNumLoops - 1) {
        console.log("inside");
        this.playbackInstance.setIsLoopingAsync(false);
      }
      this.setState({ numberOfLoops: this.state.numberOfLoops + 1 });
    }
  };

  // it will run in bg, so this.state.sound has not been changed yet
  async _loadNewPlaybackInstance(targetNumLoops) {
    //Existed before, clear everything previously
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();

      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    let source = require("../assets/sounds/bell_sound.wav");
    // NOTE THAT SETSTATE IS ASYNCHRONOUS - this.state is not immediately changed. use callback instead
    switch (this.props.route.params.gongSound) {
      case "Gong":
        //do nothing, use default
        source = require("../assets/sounds/gong_sound.wav");
        break;
      case "Bell":
        source = require("../assets/sounds/bell_sound.wav");
        break;
      case "Singing Bowl":
        source = require("../assets/sounds/singingbowl_sound.wav");

        break;
    }

    const initialStatus = {
      //        Play by default
      shouldPlay: true,
      //        Control the speed
      rate: 1.0,
      //        Correct the pitch
      shouldCorrectPitch: true,
      //        Control the Volume
      volume: 1.0,
      //        mute the Audio
      isMuted: false,
    };
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus
    );
    //  Save the response of sound in playbackInstance
    this.playbackInstance = sound;
    // start loop count
    this.setState({ numberOfLoops: 1 });

    //if param is not undefined, means loop  # times
    if (targetNumLoops != undefined) {
      this.setState({ targetNumLoops });
      this.playbackInstance.setOnPlaybackStatusUpdate(
        this._onPlaybackStatusUpdate
      );
      //  Make the loop of Audio
      this.playbackInstance.setIsLoopingAsync(true);
    } else {
      // else no loop
      this.playbackInstance.setIsLoopingAsync(false);
    }

    //  Play the Music
    this.playbackInstance.playAsync();
  }

  // End screen alerts
  endEarly = () => {
    return Alert.alert(
      "Confirm choice",
      "Are you sure you want to end the session?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => this.props.navigation.navigate("Home") },
      ],
      { cancelable: false }
    );
  };
  finishAlert = () => {
    // ring bell 3x when 30s left
    this._loadNewPlaybackInstance();

    return Alert.alert(
      "Congratulations!",
      "You have completed the session and obtained 1 lotus!",
      [{ text: "Ok", onPress: () => this.props.navigation.navigate("Home") }],
      { cancelable: false }
    );
  };
  render() {
    return (
      <ImageBackground
        blurRadius={2}
        style={styles.background}
        source={this.state.backgroundImg}
        resizeMode="cover"
      >
        <AnimatedCircularProgress
          easing={Easing.linear}
          duration={this.props.route.params.time * 1000}
          size={250}
          width={20}
          fill={100}
          tintColor="#00e0ff"
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor="#3d5875"
          style={styles.progressCircle}
        />
        <View style={styles.innerFrame}>
          {/* <Text style={styles.timeText}>13:52</Text> */}
          {/* https://www.npmjs.com/package/react-native-countdown-component */}
          <CountDown
            until={this.props.route.params.time}
            onFinish={() => this.finishAlert()}
            // onPress={() => alert("pause")}
            size={40}
            // show diff based on total time
            timeToShow={["M", "S"]}
            timeLabels={{}}
            // Style the text color and bg
            digitStyle={{ backgroundColor: "#919191" }}
            // digitTxtStyle={styles.timeText}
            // separatorStyle={styles.timeText}
            showSeparator
          />
        </View>

        <MyBtn
          style={styles.endBtn}
          title="End Session"
          onPress={() => this.endEarly()}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  endBtn: {
    position: "absolute",
    bottom: 80,
    // alignSelf: "center",
  },

  progressCircle: {
    position: "absolute",
    height: 300,
    width: 300,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "#41404E",
    // borderWidth: 15,
  },
  innerFrame: {
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: "#919191",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.black,
  },
});
