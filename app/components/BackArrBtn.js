import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";

export default function MyBtn({ onPress, style }) {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Ionicons name="md-arrow-back" size={48} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
