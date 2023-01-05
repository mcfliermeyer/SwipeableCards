import { ReactNode, useEffect, useRef, useState } from "react";
import { Dimensions, View, Image, Animated, PanResponder } from "react-native";
import SwipeableCard from "./components/SwipeableCard";


let data = [
  { id: "1", uri: require("./assets/1.jpg") },
  { id: "2", uri: require("./assets/2.jpg") },
  { id: "3", uri: require("./assets/3.jpg") },
];





export default function App() {
  const [cardArray, setCardArray] = useState(data);

  const moveTopCardToBottom = () => {
    //move card from anywhere in deck to front of array using unshift
    //first card to display is last in array
    let cardsCopy = [...cardArray]; //shallow copy of array to mutate
    const cardToMove = cardsCopy.pop() //locate card with id
    cardsCopy.unshift(cardToMove!); //put card in array front which is bottom of the deck
    setCardArray(() => cardsCopy); //change state for re-render
  };
  //create stacked cards that will be able to drag around top card
  const renderCardsFromData = () => {
    return cardArray.map((item, i) => {
      return (
        <SwipeableCard
          key={item.id}
          item={item}
          index={i}
          moveTopCardToBottom={() => moveTopCardToBottom()}
        ></SwipeableCard>
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
