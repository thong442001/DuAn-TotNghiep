import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Pressable, Alert, ToastAndroid } from 'react-native';
import styles from '../styles/screens/LoginS';
import Icon from 'react-native-vector-icons/Ionicons';

import { login } from '../../rtk/API';
import { useDispatch } from 'react-redux';
import { CustomTextInputEmail, CustomTextInputPassword } from '../custom/CustomTextInput';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [email, setEmail] = useState('')
  const [password, setPasword] = useState('')

  const onLogin = () => {
    const data = { email, password };
    dispatch(login(data))
      .unwrap()
      .then(() => {
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT)
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show('Email hoặc mật khẩu không chính xác', ToastAndroid.SHORT)
      })
  }

  return (
    <View style={styles.ViewAll}>
      <View style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Icon name="arrow-back-circle" size={40} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Hey,{'\n'}Welcome Back</Text>
          <Text style={styles.subheaderText}>Please login to continue</Text>


          <CustomTextInputEmail
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail} />

          <CustomTextInputPassword
            placeholder="Enter your password"
            value={password}
            onChangeText={setPasword} />

        </View>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>

        <TouchableOpacity style={styles.loginButton} onPress={(onLogin)}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.signupText} onPress={() => navigation.navigate('Register')}>Sign up</Text>
        </Text>
      </View>
    </View>

  );
};

export default Login;
