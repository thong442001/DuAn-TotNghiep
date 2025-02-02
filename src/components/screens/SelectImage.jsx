import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import SelectImageS from '../styles/screens/SelectImageS'
import Icon from 'react-native-vector-icons/Ionicons'; // Hoặc một bộ icon khác
import { Image } from 'react-native-animatable';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// test Thong
import { useSelector } from 'react-redux';
import Dialog from "react-native-dialog";

const SelectImage = (props) => {
    const { navigation } = props

    //img
    const [image, setImage] = useState(null);

    // Thong 
    const theme = useSelector(state => state.app.theme);
    const language = useSelector(state => state.app.language);
    //dialog 
    const [ShowDialog, setShowDialog] = useState(false);
    const handle_huy = () => {
        setShowDialog(false)
    };
    const handle_dong_y = () => {
        setShowDialog(false);
        setImage(null);
        navigation.goBack();
    };



    // hàm chụp ảnh
    const onOpenCamera = async () => {
        try {
            const options = {
                mediaType: 'photo',
                quality: 1,
                cameraType: 'back',
                saveToPhotos: true,
            }
            launchCamera(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                }
                else {
                    //console.log('response -> ', response);
                    setImage(response.assets[0]);
                    // upload
                    // await uploadImage(response.assets[0]);
                }
            });
        } catch (error) {
            console.log('onOpenCamera -> ', error);
        }
    };

    //hàm lấy ảnh từ library
    const getImage = async () => {
        try {
            const options = {
                mediaType: 'photo',
                quality: 1,
                cameraType: 'back',
                saveToPhotos: true,
            }
            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorMessage) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                }
                else {
                    //console.log('response -> ', response);
                    setImage(response.assets[0]);
                    // upload
                    ///await uploadImage(response.assets[0]);
                }
            });
        } catch (error) {
            console.log('onOpenCamera -> ', error);
        }
    };
    return (
        <View style={[{ height: "100%" }, { backgroundColor: theme ? "white" : "#242827" }]}>
            <View style={SelectImageS.box}>
                <View style={SelectImageS.close}>
                    <TouchableOpacity onPress={() => image ? setShowDialog(true) : navigation.goBack()}>
                        <Icon name="close" size={35} color={theme ? "black" : "white"} style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                    <Text style={[SelectImageS.h1, { color: theme ? "black" : "white" }]}>{language ? "New post" : "Bài đăng mới"}</Text>
                </View>
                <View>
                    {
                        image ? (
                            <TouchableOpacity onPress={() => navigation.navigate("UpPost", { image: image })}>
                                <Text style={SelectImageS.h2}>{language ? "Next" : "Tiếp"}</Text>
                            </TouchableOpacity>
                        ) : null
                    }

                </View>
            </View>
            {
                image ? <Image
                    source={{ uri: image.uri }}
                    style={SelectImageS.image} /> :
                    <View style={SelectImageS.boxImage}></View>
            }
            <View style={SelectImageS.option}>
                <TouchableOpacity style={[SelectImageS.btn, { backgroundColor: theme ? "black" : "white" }]} onPress={getImage}>
                    <Text style={[SelectImageS.h3, { color: theme ? "white" : "black" }]}>{language ? "Select Image" : "Chọn thư viện"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[SelectImageS.btn, { backgroundColor: theme ? "black" : "white" }]} onPress={onOpenCamera}>
                    <Text style={[SelectImageS.h3, { color: theme ? "white" : "black" }]}>{language ? "Take a picture" : "Chụp ảnh"}</Text>
                </TouchableOpacity>
            </View>

            {/* Dialog  logout*/}
            <Dialog.Container visible={ShowDialog}>
                {/* title */}
                <Dialog.Title>Thông báo</Dialog.Title>
                {/* nội dung */}
                <Dialog.Description>Bạn có chắc chắn thoát ?</Dialog.Description>
                {/* btn hủy */}
                <Dialog.Button label="Huỷ"
                    onPress={() => handle_huy()} />
                {/* btn đồng ý */}
                <Dialog.Button label="Đồng ý"
                    onPress={() => handle_dong_y()} />
            </Dialog.Container>

        </View >

    )
}

export default SelectImage

