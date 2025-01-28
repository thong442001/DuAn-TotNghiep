import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
//import { socket } from "../../utils/index";
import Messagecomponent from "./Messagecomponent";

const HomeChat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const user = useSelector(state => state.app.user);

    useEffect(() => {
        // Kết nối tới server
        const newSocket = io('http://192.168.1.6:3001', {// Đổi localhost thành IP máy chủ nếu dùng thiết bị thật
            transports: ['polling'], // Ensure you're using polling
        });
        setSocket(newSocket);
        //console.log(newSocket)

        // Lắng nghe tin nhắn từ server
        newSocket.on('receive_message', (data) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: new Date().getTime().toString(),
                    userID: data.userID,
                    user: data.user,
                    avatar: data.avatar,
                    text: data.text,
                    time: data.time,
                }
            ]);
            console.log(data)
        });

        newSocket.on('connect', () => console.log('Connected to server:', newSocket.id));
        newSocket.on('disconnect', () => console.log('Disconnected from server'));
        newSocket.on('connect_error', (err) => console.error('Connection error:', err.message));

        // Ngắt kết nối khi component bị hủy
        //return () => socket.disconnect();
    }, []);

    const sendMessage = () => {
        const timeData = {
            hr:
                new Date().getHours() < 10
                    ? `0${new Date().getHours()}`
                    : new Date().getHours(),
            mins:
                new Date().getMinutes() < 10
                    ? `0${new Date().getMinutes()}`
                    : new Date().getMinutes(),
        };

        if (socket && message) {
            const payload = {
                userID: user._id,
                user: user.displayName,
                avatar: user.avatar,
                text: message,
                time: `${timeData.hr}:${timeData.mins}`, // Chuyển đối tượng thành chuỗi
            };
            socket.emit('send_message', payload);
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            {/* <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.username}>{item.user}:</Text>
                        <Text style={styles.message}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            /> */}
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Messagecomponent
                        item={item}
                        currentUserID={user._id}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    )
}

export default HomeChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: 'black',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    username: {
        fontWeight: 'bold',
        marginRight: 5,
        color: 'black',
    },
    message: {
        color: 'black',
        borderRadius: 5,
        padding: 10,
    },
});

