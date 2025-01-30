import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
//import { socket } from "../../utils/index";
import Messagecomponent from "./Messagecomponent";
import {
    getGroupID,
    getMessagesGroup,
} from '../../rtk/API';
import ChatHeader from './ChatHeader';

const Chat = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);
    const [groupAvatar, setGroupAvatar] = useState(null); // Ảnh đại diện nhóm
    const [groupName, setGroupName] = useState(null); // Tên nhóm

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // lấy name vs avt
        getID_groupPrivate(params?.ID_group);
        // lấy messages old
        getMessagesOld(params?.ID_group);

        // Kết nối tới server
        const newSocket = io('http://192.168.1.7:3001', {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5, // Thử kết nối lại tối đa 5 lần
            timeout: 5000, // Chờ tối đa 5 giây trước khi báo lỗi
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Kết nối thành công:', newSocket.id);
            newSocket.emit("joinGroup", params?.ID_group);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Lỗi kết nối:', err.message);
        });
        newSocket.on('disconnect', () => {
            console.log('Mất kết nối với server');
        });

        // Lắng nghe tin nhắn từ server
        newSocket.on('receive_message', (data) => {
            //console.log(data);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data._id,
                    ID_group: data.ID_group,
                    sender: {
                        _id: data.sender,
                        displayName: data.displayName, // Lấy tên hiển thị từ sender
                        avatar: data.avatar            // Lấy avatar từ sender
                    },
                    content: data.content,
                    type: data.type,
                    ID_message_reply: data.ID_message_reply,
                    createdAt: data.createdAt,
                }
            ]);
            //console.log(data)
        });

        return () => {
            console.log('Ngắt kết nối socket');
            newSocket.disconnect();
        };
    }, [params?.ID_group]);

    //infor group
    const getID_groupPrivate = async (ID_group) => {
        try {
            await dispatch(getGroupID({ ID_group: ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    setGroup(response.group)
                    if (response.group.isPrivate == true) {
                        //console.log(response.group.members);
                        const otherUser = response.group.members.find(user => user._id !== me._id);
                        if (otherUser) {
                            setGroupName(otherUser.displayName);
                            setGroupAvatar(otherUser.avatar);
                        } else {
                            console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
                        }
                    }
                })
                .catch((error) => {
                    console.log('Error1:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api getMessagesGroupID
    const getMessagesOld = async (ID_group) => {
        try {
            await dispatch(getMessagesGroup({ ID_group: ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response)
                    setMessages(response.messages);
                })
                .catch((error) => {
                    console.log('Error2:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // gửi tin nhắt
    const sendMessage = () => {
        if (socket && message) {
            const payload = {
                ID_group: params.ID_group,
                sender: me._id,
                content: message,
                type: 'text',
                ID_message_reply: null,
            };
            socket.emit('send_message', payload);
            setMessage('');
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
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
            {
                (groupName != null
                    && groupAvatar != null)
                && < ChatHeader
                    name={groupName}
                    avatar={groupAvatar}
                    onGoBack={handleGoBack}
                />
            }
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Messagecomponent
                        item={item}
                        currentUserID={me._id}
                    />
                )}
                keyExtractor={(item) => item._id}
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

export default Chat

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

