import {
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Groupcomponent({ item }) {

  const me = useSelector(state => state.app.user);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const otherUser = item.members.find(user => user._id !== me._id);
    if (item.avatar == null) {
      if (otherUser) {
        setAvatar(otherUser.avatar);
      } else {
        console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
      }
    } else {
      setAvatar(otherUser.avatar);
    }

    if (item.name == null) {
      if (otherUser) {
        setName(otherUser.displayName);
      } else {
        console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
      }
    } else {
      setName(otherUser.displayName);
    }

  }, []);



  return (
    <View style={styles.chatItem}>
      {
        (name != null)
        && <Image source={{ uri: avatar }} style={styles.avatar} />
      }

      {
        (avatar != null)
        && <View style={styles.chatInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black",
  },
  message: {
    fontSize: 14,
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
