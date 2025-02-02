import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import UpPostS from '../styles/screens/UpPostS';
import Icon from 'react-native-vector-icons/Ionicons'; // Hoặc một bộ icon khác

// test Thong
import { addPost } from '../../rtk/API';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { oStackHome } from '../../navigations/HomeNavigation';


const UpPost = (props) => {
  const { route, navigation } = props;
  const { params } = route;
  //console.log(params.image.uri);

  // Thong 
  const user = useSelector(state => state.app.user);
  const theme = useSelector(state => state.app.theme);
  const language = useSelector(state => state.app.language);
  const dispatch = useDispatch();
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: language ? "Public" : "Công khai"
  });
  const [content, setContent] = useState('');

  // Các tùy chọn trạng thái
  const status = [
    {
      status: 1,
      name: language ? "Public" : "Công khai"
    },
    {
      status: 2,
      name: language ? "Friends" : "Bạn bè"
    },
    {
      status: 3,
      name: language ? "Just me" : "Chỉ mình tôi"
    },

  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
  };

  // upload ảnh lên cloudinary
  const uploadImage = async (image) => {
    try {
      const data = new FormData();
      data.append('file', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
        fileName: image.fileName,
      });
      data.append('upload_preset', 'nvkc2dfw');
      axios({
        url: 'https://api.cloudinary.com/v1_1/dkhvbzurh/image/upload',
        method: 'post',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        Authorization: '',
      }).then((res) => {
        //console.log('uploadImage -> ', res.data)

        const paramsAPI = {
          userId: user._id,
          content: content,
          images: [res.data.url],// 1 ảnh -> arr[0]
          status: selectedOption.status
        }
        //console.log(paramsAPI.images[0]);

        dispatch(addPost(paramsAPI))
          .unwrap()
          .then((response) => {
            ToastAndroid.show(language ? "Successful" : "Thành công"
              , ToastAndroid.SHORT)
            // về home
            navigation.navigate(oStackHome.TabHome.name);
          })
          .catch((error) => {
            console.log('Error:', error);
            ToastAndroid.show(language ? "Error" : "Lỗi"
              , ToastAndroid.SHORT)
          });

      }).catch((error) => {
        console.log('uploadImage -> ', error);
      });
      //console.log(image);
    } catch (error) {
      console.log('uploadImage -> ', error);
    }
  };
  // upload ảnh lên cloudinary
  const upPost = async () => {
    try {
      if (!btnDisabled) {
        setBtnDisabled(true);
        await uploadImage(params.image);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View>
      <ScrollView style={[{ height: "100%" }, { backgroundColor: theme ? "white" : "#242827" }]}>
        <View style={UpPostS.allbox}>
          <View style={UpPostS.box}>
            <View>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={30} color={theme ? "black" : "white"} />
              </TouchableOpacity>
            </View>
            <View style={UpPostS.h1}>
              <Text style={[UpPostS.title, { color: theme ? "black" : "white" }]}>{language ? "creat post" : "Tạo bài viết"}</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={UpPostS.upload}
              disabled={btnDisabled}
              onPress={upPost}>
              <Text style={UpPostS.textWhite}>{language ? "Up post" : "Đăng bài"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={UpPostS.line}></View>
        <View style={UpPostS.allbox2}>
          <View style={UpPostS.box2}>
            <View>
              <Image style={UpPostS.avata} source={{ uri: user.avatar }} />
            </View>
            <View style={UpPostS.h3}>
              <Text style={[UpPostS.name, { color: theme ? "black" : "white" }]}>{user.displayName}</Text>
              <View style={UpPostS.boxState}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                >
                  <View style={UpPostS.state}>
                    <Text style={UpPostS.textState}>{selectedOption.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={UpPostS.boxImage}>
            <Image style={UpPostS.image} source={{ uri: params.image.uri }} />
          </View>
          <TextInput placeholder={language ? "What are you thinking ?" : "Bạn đang nghĩ gì ?"}
            value={content}
            onChangeText={setContent}
            multiline={true} // Cho phép nhiều dòng
            placeholderTextColor={theme ? "black" : "black"}
            style={[UpPostS.content, { backgroundColor: theme ? "grey" : "grey" }]}
            textAlignVertical="top" // Văn bản sẽ bắt đầu từ trên cùng
          />
        </View>
        <View style={[UpPostS.line]}></View>
        <TouchableOpacity>
          <View style={UpPostS.menu}>
            <View style={UpPostS.box3}>
              <Icon name="pricetag-outline" size={25} color={theme ? "black" : "white"} />
              <Text style={[UpPostS.textIcon, { color: theme ? "black" : "white" }]}>{language ? "Tag people" : "Gắn thẻ"}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={25} color={theme ? "black" : "white"} />
          </View>
        </TouchableOpacity>
        <View style={[UpPostS.line]}></View>

        <TouchableOpacity>
          <View style={UpPostS.menu}>
            <View style={UpPostS.box3}>
              <Icon name="location-outline" size={25} color={theme ? "black" : "white"} />
              <Text style={[UpPostS.textIcon, { color: theme ? "black" : "white" }]}>{language ? "Location" : "Địa chỉ"}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={25} color={theme ? "black" : "white"} />
          </View>
        </TouchableOpacity>
        <View style={[UpPostS.line]}></View>
      </ScrollView >

      {/* Modal để hiển thị danh sách */}
      < Modal
        transparent={true}  // Cho phép nền của modal trong suốt, giúp nhìn thấy nền bên dưới modal.
        visible={modalVisible}  // Điều khiển việc modal có hiển thị hay không dựa trên trạng thái `modalVisible`.
        animationType="slide"  // Hiệu ứng khi modal xuất hiện. Ở đây là kiểu "slide" từ dưới lên.
        onRequestClose={() => setModalVisible(false)}  // Khi modal bị yêu cầu đóng (ví dụ trên Android khi bấm nút back), hàm này sẽ được gọi để đóng modal.
      >
        <TouchableOpacity
          style={UpPostS.modalOverlay}  // Overlay của modal, tạo hiệu ứng làm mờ nền dưới modal.
          onPress={() => setModalVisible(false)}  // Đóng modal khi người dùng chạm vào khu vực bên ngoài modal.
        >
          {/* // Nội dung chính của modal, nơi hiển thị các tùy chọn. */}
          <View style={UpPostS.modalContent}>
            {
              status.map((option, index) => (
                <TouchableOpacity
                  key={index}  // Mỗi phần tử trong danh sách cần có một key duy nhất.
                  style={UpPostS.optionButton}  // Styling cho mỗi nút tùy chọn trong danh sách.
                  onPress={() => handleSelectOption(option)}  // Khi người dùng chọn một tùy chọn, hàm này sẽ được gọi để cập nhật trạng thái và đóng modal.
                >
                  {/* // Hiển thị tên của tùy chọn. */}
                  <Text style={UpPostS.optionText}>{option.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </TouchableOpacity>
      </Modal >

    </View >
  )
}

export default UpPost
