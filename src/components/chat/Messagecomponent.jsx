import { StyleSheet, Text, View, Image } from "react-native";

export default function MessageComponent({ currentUserID, item }) {
  const isCurrentUser = item.userID === currentUserID; // Kiểm tra tin nhắn có phải của user hiện tại không

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      )}

      <View style={[styles.messageWrapper, isCurrentUser && styles.currentUserMessage]}>
        {!isCurrentUser && <Text style={styles.username}>{item.user}</Text>}
        <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  currentUserContainer: {
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 8,
  },
  messageWrapper: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#D9D9D9", // Màu tin nhắn của người khác 
  },
  currentUserMessage: {
    backgroundColor: "black", // Màu tin nhắn của người dùng hiện tại 
  },
  username: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  messageText: {
    color: "#000000",// Màu chữ trắng cho tin nhắn của người khác
    fontSize: 16,
  },
  currentUserText: {
    color: "#black", // Màu chữ trắng cho tin nhắn của bạn
  },
  messageTime: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 3,
    alignSelf: "flex-end",
  },
});
