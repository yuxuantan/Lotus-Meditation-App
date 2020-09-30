import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import colors from "../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
// import * as InAppPurchases from "expo-in-app-purchases";

export default function DonationsScreen() {
  //   const [items, setItems] = useState();
  //   const connect = async () => {
  //     await connectAsync();
  //   };
  //   const getProducts = async () => {
  //     const items = ["donate1", "donate2", "donate5", "donate10", "Other"];
  //     // Retrieve product details
  //     const { responseCode, results } = await InAppPurchases.getProductsAsync(
  //       items
  //     );
  //     if (responseCode === IAPResponseCode.OK) {
  //       setItems(results);
  //     }
  //   };

  //   useEffect(() => {
  //     connect();
  //     getProducts();
  //   }, []);
  //   InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
  //     // Purchase was successful
  //     if (responseCode === IAPResponseCode.OK) {
  //       results.forEach((purchase) => {
  //         if (!purchase.acknowledged) {
  //           console.log(`Successfully purchased ${purchase.productId}`);
  //           // Process transaction here and unlock content...

  //           // Then when you're done
  //           finishTransactionAsync(purchase, true);
  //         }
  //       });
  //     }
  //     // Else find out what went wrong
  //     if (responseCode === IAPResponseCode.USER_CANCELED) {
  //       console.log("User canceled the transaction");
  //     } else if (responseCode === IAPResponseCode.DEFERRED) {
  //       console.log(
  //         "User does not have permissions to buy but requested parental approval (iOS only)"
  //       );
  //     } else {
  //       console.warn(
  //         `Something went wrong with the purchase. Received errorCode ${errorCode}`
  //       );
  //     }
  //   });
  // PURCHASE item - purchaseItemAsync(item.productId)

  // AFTER verified transaction and unlocked functionality purchased by user - mark as complete
  //   acknowledge or consume
  // if (!purchase.acknowledged) {
  //     await finishTransactionAsync(purchase, false); // or true for consumables
  //   }

  // finish - await disconnectAsync();
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/bg_home.png")}
    >
      <AppText style={styles.headingText}>Donations</AppText>
      <AppText style={styles.textLabel}>
        We hope that this app has benefited you.{"\n"}Do donate to help us to
        continue to maintain and develop this application.{"\n\n"}Thank you :D
      </AppText>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          //   onPress={() => InAppPurchases.purchaseItemAsync("donate1")}
        >
          <AppText style={styles.text}>$1</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <AppText style={styles.text}>$2</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <AppText style={styles.text}>$5</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <AppText style={styles.text}>$10</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <AppText style={styles.text}>Other</AppText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
    backgroundColor: "white",
    borderColor: "dimgrey",
    borderWidth: 3,
    paddingHorizontal: 40,
    paddingVertical: 15,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  textLabel: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "300",
    // textTransform: "uppercase",
    marginHorizontal: 40,
    textAlign: "center",
    marginBottom: 40,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    // paddingBottom: "30%",
    // justifyContent: "space-between",
    // alignItems: "center",
    // width: 200,
  },
  headingText: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "300",
    textTransform: "uppercase",
    marginBottom: 20,
  },
});
