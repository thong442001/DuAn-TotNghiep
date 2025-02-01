import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
} from "react-native";

export default function MessageComponent({ currentUserID, item, onReply }) {
  const isCurrentUser = item.sender._id === currentUserID; // Kiểm tra tin nhắn có phải của user hiện tại không

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
  const messageRef = useRef(null); // ref để tham chiếu tới tin nhắn

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Hiển thị 24h (Bỏ dòng này nếu muốn 12h)
    });
  };

  const handleLongPress = () => {
    if (messageRef.current) {
      messageRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY - 57,
          left: pageX,
          right: pageX,
        });
        setMenuVisible(true);
      });
    }
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <Image style={styles.avatar} source={{ uri: item.sender.avatar }} />
      )}

      {/* Nhấn giữ tin nhắn để mở menu */}
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
        <View
          ref={messageRef} // Gắn ref vào đây
          style={[styles.messageWrapper, isCurrentUser && styles.currentUserMessage]}
        >
          {!isCurrentUser && <Text style={styles.username}>{item.sender.displayName}</Text>}
          {/* Hiển thị tin nhắn trả lời nếu có */}
          {item.ID_message_reply && (
            <View style={styles.replyContainer}>
              <Text
                style={styles.replyText}
                numberOfLines={2}>
                {item.ID_message_reply.content || "Tin nhắn không tồn tại"}
              </Text>
            </View>
          )}
          {/* Nội dung tin nhắn chính */}
          <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
            {item.content}
          </Text>
          {/* thời gian */}
          <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* Menu tùy chọn khi nhấn giữ */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.overlay}>
            <View
              style={[
                {
                  position: "absolute",
                  top: menuPosition.top,
                },
                isCurrentUser ? {
                  right: 10,
                  alignItems: "flex-end", // Căn phải
                }
                  : {
                    left: menuPosition.left,
                  }
              ]} // Cập nhật vị trí menu
            >
              <View
                style={[styles.reactionBar]}
              >
                {["❤️", "😂", "😲", "😢", "😡", "👍"].map((emoji, index) => (
                  <TouchableOpacity key={index} style={styles.reactionButton}>
                    <Text style={styles.reactionText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.messageWrapper, isCurrentUser && styles.currentUserMessage]}>
                {!isCurrentUser && <Text style={styles.username}>{item.sender.displayName}</Text>}
                {/* Hiển thị tin nhắn trả lời nếu có */}
                {item.ID_message_reply && (
                  <View style={styles.replyContainer}>
                    <Text style={styles.replyText} numberOfLines={2}>{item.ID_message_reply.content}</Text>
                  </View>
                )}
                {/* Nội dung tin nhắn chính */}
                <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
                  {item.content}
                </Text>
                {/* thời gian */}
                <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
              </View>

              <View
                style={[styles.menu]}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onReply(item); // Gửi tin nhắn được chọn về component cha
                    setMenuVisible(false);
                  }}>
                  <Text style={styles.menuText}>Trả lời</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuText}>Sao chép</Text>
                </TouchableOpacity>
                {
                  isCurrentUser
                  && <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Thu hồi</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View >
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
    backgroundColor: "#3A6DF0", // Màu tin nhắn của người dùng hiện tại 
  },
  username: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  messageText: {
    color: "#000000", // Màu chữ cho tin nhắn của người khác
    fontSize: 16,
  },
  currentUserText: {
    color: "#fff", // Màu chữ trắng cho tin nhắn của bạn
  },
  messageTime: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 3,
    alignSelf: "flex-end",
  },
  //reply
  replyContainer: {
    backgroundColor: "#F0F0F0",
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3A6DF0",
    marginBottom: 5,
    borderRadius: 10,
  },
  replyText: {
    fontSize: 14,
    color: "#666",
  },
  //modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  reactionBar: {
    flexDirection: "row",
    backgroundColor: "#FFFF",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  reactionButton: {
    marginHorizontal: 5,
  },
  reactionText: {
    fontSize: 20,
    color: "#000",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    width: 180,
    marginTop: 10, // Đặt menu dưới messageWrapper
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuText: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
});
