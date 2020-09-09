import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";

export default function MySmallBtn({
  title,
  onPress,
  color = "primary",
  style,
}) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={[styles.text, { backgroundColor: colors[color] }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "40%",
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "300",
  },
});
