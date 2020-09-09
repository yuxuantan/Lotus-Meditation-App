import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";

export default function MyBtn({ title, onPress, color = "primary", style }) {
  return (
    <TouchableOpacity
      style={[styles.btn, style, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "75%",
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "500",
  },
});
