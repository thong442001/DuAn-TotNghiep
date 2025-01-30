import {
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ToastAndroid,
    Dimensions,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import ProfileS from '../styles/screens/ProfileS';
import Icon from 'react-native-vector-icons/Ionicons'; // Hoặc một bộ icon khác
import ProfilePost from '../custom/ProfilePost';
import { logout } from '../../rtk/Reducer';
let date = new Date().toDateString();

// Thong
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../rtk/Reducer';
import { oStackHome } from '../../navigations/HomeNavigation';
import {
    joinGroupPrivate,
    myPost,
    getUser
} from '../../rtk/API';

const Profile = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);
    const theme = useSelector(state => state.app.theme);
    const language = useSelector(state => state.app.language);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [ID_groupPrivate, setID_groupPrivate] = useState(null);

    const onGetUser = async (userId) => {
        try {
            await dispatch(getUser({ userId: userId, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response);
                    setUser(response.user);
                })
                .catch((error) => {
                    console.log('Error:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    const onGetPosts = async (userId) => {
        try {
            await dispatch(myPost({ userId: userId, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response);
                    setPosts(response.posts);
                })
                .catch((error) => {
                    console.log('Error:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = async () => {
        let userId = params?._id || me?._id;  // Nếu có params._id thì là bạn bè, không thì là chính mình
        setUser(params?._id ? null : me); // Nếu là mình thì lấy từ Redux

        if (userId && params?._id) {
            await onGetUser(userId);
        }
        await onGetPosts(userId);
    };

    //chat
    const getID_groupPrivate = async (user1, user2) => {
        try {
            const paramsAPI = {
                user1: user1,
                user2: user2,
            }
            await dispatch(joinGroupPrivate(paramsAPI))
                .unwrap()
                .then((response) => {
                    //console.log(response);
                    setID_groupPrivate(response?.ID_group);
                })
                .catch((error) => {
                    console.log('Error1:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }
    const onChat = async () => {
        await getID_groupPrivate(params?._id, me?._id)
        ID_groupPrivate != null && navigation.navigate("Chat", { ID_group: ID_groupPrivate })
    }

    useEffect(() => {
        fetchData();
    }, [params?._id, me]); // Chạy lại nếu params._id hoặc me thay đổi

    return (
        <ScrollView style={[ProfileS.all, { backgroundColor: theme ? "#f7f7f7" : "#242827" }]}>
            <View style={ProfileS.superBox}>
                {/* header */}
                <View style={ProfileS.container}>
                    {/* title */}
                    <Text style={[ProfileS.h1, { color: theme ? "black" : "white" }]}>
                        {language ? "Profile" : "Trang cá nhân"}</Text>

                    <TouchableOpacity style={{ position: "absolute", right: 40 }} onPress={() => navigation.navigate(oStackHome.SelectImage.name)}>
                        <Icon name="add-circle-outline" size={30} color={theme ? "black" : "white"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ position: "absolute", right: 0 }} onPress={() => navigation.navigate("Setting")}>
                        <Icon name="menu" size={30} color={theme ? "black" : "white"} />
                    </TouchableOpacity>
                </View>

                {
                    user && (
                        <View style={ProfileS.box}>
                            <Image style={ProfileS.avata} source={{ uri: user?.avatar }} />
                            <Text style={[ProfileS.name, { color: theme ? "black" : "white" }]}>{user?.displayName}</Text>
                            <Text style={[ProfileS.bio, { color: theme ? "black" : "white" }]}>{user?.bio}</Text>
                        </View>

                    )
                }

                {/* bạn bè */}
                {
                    user && (user._id !== me._id && (
                        <View>
                            <TouchableOpacity style={styles.btn} onPress={onChat}>
                                <Text style={styles.txt}>Nhắn tin</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => { }}>
                                <Text style={styles.txt}>Gửi lời mời</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }

                {/* List of posts */}
                {
                    posts.map((item) => (
                        <ProfilePost key={item._id} dataProfile={item} />
                    ))
                }

            </View >
        </ScrollView >
    )
}

export default Profile

const styles = StyleSheet.create({
    btn: {
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').height * 0.05,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0064E0',
        borderRadius: 8,
        margin: 10,
    },
    txt: {
        color: '#FFFFFF',
    }
})
