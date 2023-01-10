import { View} from "react-native";
import SwipeableCardDeck from "./components/SwipeableCardDeck";
export default function App() {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ height: 90 }}></View>
      <SwipeableCardDeck>
        <View
          style={{
            flex: 1,
            width: 200,
            height: 200,
            borderRadius: 20,
            backgroundColor: "red",
          }}
        />
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            borderRadius: 20,
            backgroundColor: "blue",
          }}
        />
        <View
          style={{
            flex: 1,
            width: 200,
            height: 200,
            borderRadius: 20,
            backgroundColor: "orange",
          }}
        />
      </SwipeableCardDeck>
      <View style={{ height: 20 }}></View>
    </View>
  );
}
