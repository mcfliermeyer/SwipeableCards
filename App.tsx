import { disableErrorHandling } from "expo";
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

type CardProps = {
  item: { id: string; uri: any };
  moveCard: (id: string) => void;
  swipedDirection: (direction: string) => void;
};

const SwipeableCard = ({ item, moveCard, swipedDirection }: CardProps) => {
  const [yPosition, setYPosition] = useState(new Animated.Value(0));
  let swipeDirection = "";
  const rotateCard = yPosition.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponderCapture: () => true,
    // onPanResponderGrant: () => {
    //   pan.setOffset({
    //     x: pan.x._value,
    //     y: pan.y._value,
    //   });
    // },
    onPanResponderMove: (_, gestureState) => {
      yPosition.setValue(gestureState.dy);
      if (gestureState.dy < -SCREEN_HEIGHT / 2 + 200) {
        swipeDirection = "Up";
        //swipe up
      } else if (gestureState.dy > SCREEN_HEIGHT / 2 - 200) {
        swipeDirection = "Down";
        //swipe down
      } else {
        swipeDirection = "--";
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (
        // if swipe up or down isnt far enough, bring back to center
        gestureState.dy > -SCREEN_HEIGHT / 2 + 200 &&
        gestureState.dy < SCREEN_HEIGHT / 2 - 200
      ) {
        Animated.spring(yPosition, {
          toValue: 0,
          speed: 5,
          bounciness: 5,
          useNativeDriver: false,
        }).start();
      } else {
        //swipe was far enough up or down, move card out
        if (gestureState.dy < -SCREEN_HEIGHT / 2 + 200) {
          //swiped up
          Animated.timing(yPosition, {
            toValue: -SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(yPosition, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
        swipedDirection(swipeDirection);
        moveCard(item.id);
      }
    },
  });
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        height: SCREEN_HEIGHT - 120,
        width: SCREEN_WIDTH,
        padding: 10,
        position: "absolute",
        transform: [{ translateY: yPosition }, { rotate: rotateCard }],
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
};

export default function App() {
  const [cardArray, setCardArray] = useState(foods);
  const [swipeDirection, setSwipeDirection] = useState("--");

  const moveCard = (id: string) => {
    const lastCard = cardArray.pop()!;
    cardArray.unshift(lastCard);
    setCardArray(cardArray);
  };

  // replaceTopCard(cardArray)

  //create stacked cards that will be able to drag around from top
  const renderFoods = () => {
    return cardArray.map((item, i) => {
      return (
        <SwipeableCard
          key={item.id}
          item={item}
          moveCard={() => moveCard(item.id)}
          swipedDirection={() => swipeDirection}
        />
      );
    });
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
let foods = [
  { id: "1", uri: require("./assets/1.jpg") },
  { id: "2", uri: require("./assets/2.jpg") },
  { id: "3", uri: require("./assets/3.jpg") },
  // { id: "4", uri: require("./assets/4.jpg") },
  // { id: "5", uri: require("./assets/5.jpg") },
];
