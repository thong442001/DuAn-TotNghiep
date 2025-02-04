import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../styles/screens/WelcomeS';

const Welcome = () => {
  const [dots, setDots] = useState('');  

  useEffect(() => {
    // Tạo hiệu ứng dấu chấm chạy
    const interval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval); 
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewLogo}>
        <Image
          style={styles.logo}
          source={require('../../assets/image/Logo_app.png')}
        />
      </View>
      
      <Text style={styles.headerText}>
           { dots}  
      </Text>
    </View>
  );
};

export default Welcome;
