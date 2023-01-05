import { ReactNode } from 'react'
import { View, Text } from 'react-native'
import SwipeableCard from './SwipeableCard';
type Props = {
  children: ReactNode[];
}
const SwipeableCardDeck = ({children, ...props}: Props) => {
  // moveTopCardToBottom={() => moveTopCardToBottom()}

  return (
    <View style={{ flex: 1 }}>
      {children.map((component, index) => (
        <SwipeableCard key={index} index={index}>
          {component}
        </SwipeableCard>
      ))}
    </View>
  );
}
export default SwipeableCardDeck