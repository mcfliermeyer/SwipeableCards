import { ReactNode, useEffect, useRef, useState } from "react";
import { Dimensions, View, Image, Animated, PanResponder } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

type CardProps = {
  item: { id: string; uri: any };
  moveTopCardToBottom: () => void;
  index: number;
  children?: ReactNode;
};

const SwipeableCard = ({
  children,
  item,
  moveTopCardToBottom,
  index,
  ...props
}: CardProps) => {
  const yPosition = useRef(new Animated.Value(0)).current;
  const cardDeckOffset = useRef(0);
  const BASE = -35;

  useEffect(() => {
    cardDeckOffset.current = BASE + 9 * index + index * 8;
    Animated.spring(yPosition, {
      toValue: cardDeckOffset.current,
      speed: 5,
      useNativeDriver: false,
    }).start();
  });

  const rotateCard = yPosition.interpolate({
    //gives card slight rotation when swiping
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (_, gestureState) => {
      yPosition.setValue(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (
        // if swipe up or down isnt far enough, bring back to center
        gestureState.dy > -SCREEN_HEIGHT / 2 + 200 &&
        gestureState.dy < SCREEN_HEIGHT / 2 - 200
      ) {
        //animates card back to center
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
          //swiped down
          Animated.timing(yPosition, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
        moveTopCardToBottom(); //moves card to front of array and bottom of deck
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

export default SwipeableCard