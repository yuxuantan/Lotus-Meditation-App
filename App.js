import React from "react";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./app/screens/HomeScreen";
import SettingScreen from "./app/screens/SettingScreen";
import InProgressScreen from "./app/screens/InProgressScreen";
import AchievementsScreen from "./app/screens/AchievementsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// const Home = () => <HomeScreen />;
// const Setting = () => <SettingScreen />;

const Stack = createStackNavigator();
const StackNavigator = () => (
  // Can set initial route name using prop initialRouteName
  <Stack.Navigator
    initialRouteName="Home"
    //Global options
    screenOptions={{
      headerShown: false,
    }}
  >
    {/* Start from the top */}
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      // individual screen options - this will override if it conflicts with global
      options={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "white",
      }}
    />
    <Stack.Screen name="Setting" component={SettingScreen} />
    <Stack.Screen
      name="InProgress"
      component={InProgressScreen}
      options={{ title: "In Progress" }} // this sets title manually. if dynamically: options={({route})=>({title:route.params.id})}
      //options can customize header too
    />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
