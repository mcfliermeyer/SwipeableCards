import { useEffect, useRef, useState } from "react";
import { Dimensions, View, Image, Animated, PanResponder } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
let data = [
  { id: "1", uri: require("./assets/1.jpg") },
  { id: "2", uri: require("./assets/2.jpg") },
  { id: "3", uri: require("./assets/3.jpg") },
];

type CardProps = {
  item: { id: string; uri: any };
  moveAnyCardToBottom: (id: string) => void;
  index: number;
};

const SwipeableCard = ({ item, moveAnyCardToBottom, index }: CardProps) => {
  const yPosition = useRef(new Animated.Value(0)).current;

  const rotateCard = yPosition.interpolate({
    //gives card slight rotation when swiping
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  let offset = 0;
  if (index == 0) offset -= 35;
  else if (index == 1) offset -= 18;
  const offsetAnimation = () => {
    Animated.spring(yPosition, {
      toValue: offset,
      speed: 5,
      useNativeDriver: false,
    }).start();
  };
  offsetAnimation()
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
        moveAnyCardToBottom(item.id); //moves card to front of array and bottom of deck
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
        transform: [
          { translateY: yPosition },
          { rotate: rotateCard },
        ],
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
  const [cardArray, setCardArray] = useState(data);

  const moveAnyCardToBottom = (id: string) => {
    //move card from anywhere in deck to front of array using unshift
    //first card to display is last in array
    let cardsCopy = [...cardArray]; //shallow copy of array to mutate
    const cardToMove = cardsCopy.find((card) => card.id == id); //locate card with id
    cardsCopy.splice(cardsCopy.findIndex((card) => card.id == id)); //remove just that card
    cardsCopy.unshift(cardToMove!); //put card in array front which is bottom of the deck
    setCardArray(() => cardsCopy); //change state for re-render
  };
  //create stacked cards that will be able to drag around from top
  const renderCardsFromData = () => {
    return cardArray.map((item, i) => {
      return (
        <SwipeableCard
          key={item.id}
          item={item}
          index={i}
          moveAnyCardToBottom={() => moveAnyCardToBottom(item.id)}
        />
      );
    });
  };

  //App Views
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}></View>
      <View style={{ flex: 1 }}>{renderCardsFromData()}</View>
      <View style={{ height: 60 }}></View>
    </View>
  );
}
