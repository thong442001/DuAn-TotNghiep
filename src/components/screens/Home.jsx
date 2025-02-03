import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import HomeS from '../styles/screens/HomeS';
import Post from '../custom/Post';

// test Thong
import { useDispatch } from 'react-redux';
import { setTheme } from '../../rtk/Reducer';
import { oStackHome } from '../../navigations/HomeNavigation';

import Icon from 'react-native-vector-icons/Ionicons'; // Hoặc một bộ icon khác
import { getAllUsers } from '../../rtk/API';

let date = new Date().toDateString()
const listPost = [
    {
        id: 1,
        name: "Trung Nguyen",
        date: date,
        avata: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
        title: "Have a nice day",
        image: "https://www.adorama.com/alc/wp-content/uploads/2017/11/shutterstock_114802408.jpg"
    },
    {
        id: 2,
        name: "Tôi là 10 gió",
        date: date,
        avata: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671159.jpg",
        title: "Susan 0175 wtf ??",
        image: "https://i.vietgiaitri.com/2022/12/13/susan-0175-cua-thay-giao-ba-xuat-hien-trong-dau-truong-chan-ly-lam-fan-bat-cuoi-d1c-6792234.jpg"
    },
    {
        id: 3,
        name: "Top 4 người tôi luôn tin tưởng",
        date: date,
        avata: "https://img.freepik.com/premium-psd/3d-illustration-human-avatar-profile_23-2150671171.jpg",
        title: "Today, I give my wife 5M =))",
        image: "https://i.pinimg.com/736x/fa/fc/4b/fafc4b1052deae2438681e45ff7335a5.jpg"
    },
    {
        id: 4,
        name: "Trung Nguyen",
        date: date,
        avata: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
        title: "Bruh",
        image: "https://www.didongmy.com/vnt_upload/news/05_2024/anh-27-meme-dang-yeu-didongmy.jpg"
    },
    {
        id: 5,
        name: "Trung Nguyen",
        date: date,
        avata: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
        title: "OMG !!",
        image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/12/dtcl-meta-tft-13-24-thumb.jpg"
    },
]
const Home = (props) => {
    const { navigation } = props;

    //test Thong
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const onTheme = () => {
        dispatch(setTheme());
    }

    // const getTest = async () => {
    //     try {
    //         const result = await dispatch(getAllUsers())
    //         //console.log("===>", result);
    //         setUsers(result.payload);
    //         console.log(result.payload);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // useEffect(() => {
    //     getTest();
    //     //console.log(users);
    //     return () => {
    //     }
    // }, [users])


    return (
        <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
            <View style={HomeS.container}>
                <View style={HomeS.header}>
                    <View>
                        <TouchableOpacity onPress={onTheme}>
                            <Text style={HomeS.h1}>Linkage</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={HomeS.row}>
                        <TouchableOpacity onPress={() => navigation.navigate(oStackHome.SelectImage.name)}>
                            <Icon name="add-circle-outline" size={30} color="black" style={{ marginRight: 15 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate(oStackHome.Search.name)}>
                            <Icon name="search-outline" size={30} color="black" style={{ marginRight: 15 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate(oStackHome.HomeChat.name)}>
                            <Icon name="chatbox-ellipses-outline" size={30} color="black" style={{ marginRight: 0 }} />
                        </TouchableOpacity>
                        {/* <Pressable onPress={() => navigation.navigate('Profile')}>
                            <Image style={HomeS.avatar} source={{ uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" }} />
                        </Pressable> */}
                    </View>
                </View>
            </View>
            <FlatList
                data={listPost}
                renderItem={({ item }) => <Post dataP={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom if needed
            />
        </View >
    )
}


export default Home
