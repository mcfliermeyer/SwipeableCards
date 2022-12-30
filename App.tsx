import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const Foods = [
    { id: "1", uri: require("./assets/1.jpg") },
    { id: "2", uri: require("./assets/2.jpg") },
    { id: "3", uri: require("./assets/3.jpg") },
    { id: "4", uri: require("./assets/4.jpg") },
    { id: "5", uri: require("./assets/5.jpg") },
  ];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              height: SCREEN_HEIGHT - 120,
              width: SCREEN_WIDTH,
              padding: 10,
            },
          ]}
        >
          <Image
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 20,
            }}
            source={Foods[0].uri}
          />
        </Animated.View>
      </View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
