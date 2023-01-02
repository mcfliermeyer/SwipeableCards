import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  PanResponder,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [cardIndex, setCardIndex] = useState(0);
  const pan = useRef<any>(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        pan.y.setValue(gestureState.dy);
        if (gestureState.dy < -SCREEN_HEIGHT / 2 + 200) {
          //swipe up
        } else if (gestureState.dy > SCREEN_HEIGHT / 2 - 200) {
          //swipe down
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (
          // if swipe up or down isnt far enough, bring back to center
          gestureState.dy > -SCREEN_HEIGHT / 2 + 200 &&
          gestureState.dy < SCREEN_HEIGHT / 2 - 200
        ) {
          Animated.spring(pan.y, {
            toValue: 0,
            speed: 5,
            bounciness: 5,
            useNativeDriver: false,
          }).start();
        } else {
          //swipe was far enough up or down, move card out
          if (gestureState.dy < -SCREEN_HEIGHT / 2 + 200) {
            //swiped up
            Animated.timing(pan.y, {
              toValue: -SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: false,
            }).start();
          } else {
            Animated.timing(pan.y, {
              toValue: SCREEN_HEIGHT,
              duration: 200,
              useNativeDriver: false,
            }).start();
          }
        }
        // pan.flattenOffset();
      },
    })
  ).current;
  // let rotateCard = pan.y.interpolate({
  //     inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  //     outputRange: ["-10deg", "0deg", "10deg"],
  //     extrapolate: "clamp",
  // });
  // pan.current.rotate = pan.current.position.x.interpolate({
  //   inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  //   outputRange: ["-10deg", "0deg", "10deg"],
  //   extrapolate: "clamp",
  // });
  // pan.current.rotateAndTranslate = {
  //   transform: [{
  //     rotate: pan.rotate
  //   },
  //   ...pan.position.getTranslateTransform()
  //   ]
  // }

  const Foods = [
    { id: "1", uri: require("./assets/1.jpg") },
    { id: "2", uri: require("./assets/2.jpg") },
    { id: "3", uri: require("./assets/3.jpg") },
    // { id: "4", uri: require("./assets/4.jpg") },
    // { id: "5", uri: require("./assets/5.jpg") },
  ];
  //create stacked cards that will be able to drag around from top
  const renderFoods = () => {
    return Foods.map((item, i) => {
      if (i === cardIndex) {
        return (
          <Animated.View
            key={i}
            style={{
              height: SCREEN_HEIGHT - 120,
              width: SCREEN_WIDTH,
              padding: 10,
              position: "absolute",
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            <Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 20,
              }}
              source={item.uri}
            />
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={i}
            style={{
              height: SCREEN_HEIGHT - 120,
              width: SCREEN_WIDTH,
              padding: 10,
              position: "absolute",
            }}
          >
            <Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 20,
              }}
              source={item.uri}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  //actual view
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>{renderFoods()}</View>
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
