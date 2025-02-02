import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Platform,
    Keyboard, // bàn phím
} from 'react-native';
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
    const [reply, setReply] = useState(null);

    const flatListRef = useRef(null); // Tạo ref cho FlatList

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        // lấy name vs avt
        getID_groupPrivate(params?.ID_group);
        // lấy messages old
        getMessagesOld(params?.ID_group);

        // Kết nối tới server
        const newSocket = io('http://192.168.1.71:3001', {
            transports: ['websocket', 'polling'],
            reconnection: true,   // Cho phép tự động kết nối lại
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
                    ID_message_reply: data.ID_message_reply
                        ? {
                            _id: data.ID_message_reply._id,
                            content: data.ID_message_reply.content || "Tin nhắn không tồn tại",
                        }
                        : null,
                    createdAt: data.createdAt,
                    _destroy: data._destroy
                }
            ]);
        });

        // Lắng nghe tin nhắn từ server
        newSocket.on('message_revoked', (data) => {
            //console.log("🔥 Đã nhận được message_revoked:");
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.map(msg =>
                    msg._id === data.ID_message ? { ...msg, _destroy: true } : msg
                );
                //console.log("📌 Danh sách tin nhắn sau khi thu hồi:", updatedMessages);
                return updatedMessages;
            });
        });



        //bàn phím
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setKeyboardVisible(false);
        });

        return () => {
            console.log('Ngắt kết nối socket');
            newSocket.disconnect();
            // bàn phím
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
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
                    //console.log(response.messages)
                    setMessages(response.messages);
                })
                .catch((error) => {
                    console.log('Error2:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // gửi tin nhắn
    const sendMessage = () => {
        if (socket && message) {
            const payload = {
                ID_group: params.ID_group,
                sender: me._id,
                content: message,
                type: 'text',
                ID_message_reply: reply
                    ? {
                        _id: reply._id,
                        content: reply.content || "Tin nhắn không tồn tại", // Đảm bảo không bị undefined
                    }
                    : null,
            };
            socket.emit('send_message', payload);
            setMessage('');
            setReply(null); // Xóa tin nhắn trả lời sau khi gửi
            Keyboard.dismiss();// tắc bàn phím
        }
    };

    const handleGoBack = () => {
        navigation.navigate("HomeChat")
    };

    useEffect(() => {
        // Cuộn xuống tin nhắn cuối cùng khi danh sách tin nhắn thay đổi
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
    }, [messages]);

    // Xử lý thu hồi tin nhắn
    const revokeMessage = (ID_message) => {
        const payload = {
            ID_message: ID_message,
            ID_group: params.ID_group
        };
        socket.emit('revoke_message', payload);
        //console.log("Sự kiện thu hồi tin nhắn đã phát đi:", ID_message);
    };

    return (
        <View style={[styles.container,
        {
            //paddingBottom: keyboardHeight
            paddingBottom: Dimensions.get('window').height * 0.1,
        }]}>
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
                ref={flatListRef} // Gán ref cho FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={messages}
                renderItem={({ item }) => (
                    <Messagecomponent
                        item={item}
                        currentUserID={me._id}
                        onReply={() => setReply(item)}
                        onRevoke={revokeMessage}// Truyền xuống để cập nhật danh sách tin nhắn
                    />
                )}
                keyExtractor={(item) => item._id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            {/* bàn phím */}
            {
                keyboardVisible && (
                    <View style={styles.keyboardSpacer} />
                )
            }
            {/* <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={sendMessage} /> */}

            {
                reply && (
                    <View style={styles.replyPreview}>
                        <View>
                            <Text style={styles.replyTitle}>Đang trả lời: </Text>
                            <Text style={styles.replyContent}>{reply.content}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.replyRight}
                            onPress={() => setReply(null)}
                        >
                            <Text style={styles.replyTitle}>✖</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor={'grey'}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
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
    // bàn phím
    inputContainer: {
        height: Dimensions.get('window').height * 0.1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8f8f8',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 20,
        color: "#000",
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    keyboardSpacer: {
        //backgroundColor: 'blue',
        height: Platform.OS === 'ios' ? 20 : 10, // Adjust spacer height based on platform
    },
    //reply
    replyPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: 'grey',
    },
    replyTitle: {
        color: 'black',
    },
    replyContent: {
        color: 'grey',
    },
    replyRight: {
        alignItems: 'flex-end',
    }
});

