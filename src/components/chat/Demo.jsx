import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
// cài thư viện: npm install react-native-reanimated
const REACTIONS = [
  {id: 'like', icon: '👍', label: 'Thích'},
  {id: 'love', icon: '❤️', label: 'Yêu thích'},
  {id: 'haha', icon: '😂', label: 'Haha'},
  {id: 'wow', icon: '😮', label: 'Wow'},
  {id: 'sad', icon: '😢', label: 'Buồn'},
  {id: 'angry', icon: '😡', label: 'Phẫn nộ'},
];

const REACTION_WIDTH = 60;
const REACTIONS_CONTAINER_WIDTH = REACTIONS.length * REACTION_WIDTH;
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ReactionPicker = () => {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const reactionsOpacity = useRef(new Animated.Value(0)).current;
  const reactionsScale = useRef(new Animated.Value(0)).current;
  const holdTimeout = useRef(null); // Ref để lưu timeout

  const showReactions = () => {
    setReactionsVisible(true);
    Animated.parallel([
      Animated.timing(reactionsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(reactionsScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideReactions = () => {
    Animated.parallel([
      Animated.timing(reactionsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(reactionsScale, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setReactionsVisible(false);
    });
  };

  const handlePressIn = () => {
    holdTimeout.current = setTimeout(() => {
      showReactions();
    }, 100); // Hiển thị reaction sau 0.3 giây
  };

  const handlePressOut = () => {
    clearTimeout(holdTimeout.current);
    if (!reactionsVisible) {
      hideReactions();
    }
  };

  const handleReactionSelect = reactionId => {
    console.log(reactionId);
    setSelectedReaction(reactionId);
    hideReactions();
  };

  return (
    <View style={styles.container}>
      {/* Nút chính */}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={styles.likeButton}>
          <Text style={styles.likeButtonText}>
            {selectedReaction
              ? `${REACTIONS.find(r => r.id === selectedReaction).icon} ${
                  REACTIONS.find(r => r.id === selectedReaction).label
                }`
              : '👍 Thích'}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Reactions */}
      {reactionsVisible && (
        <Animated.View
          style={[
            styles.reactionsContainer,
            {
              opacity: reactionsOpacity,
              transform: [{scale: reactionsScale}, {translateY: -80}],
            },
          ]}>
          {REACTIONS.map(reaction => (
            <TouchableOpacity
              key={reaction.id}
              onPress={() => handleReactionSelect(reaction.id)}
              style={styles.reactionItem}>
              <Text style={styles.reactionIcon}>{reaction.icon}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    padding: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
  },
  likeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reactionsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  reactionItem: {
    width: REACTION_WIDTH,
    height: REACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionIcon: {
    fontSize: 28,
  },
});

export default ReactionPicker;
