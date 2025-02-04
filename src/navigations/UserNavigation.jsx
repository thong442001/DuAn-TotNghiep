import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const UserStack = createNativeStackNavigator();
import Login from '../components/screens/Login';
import Screen1 from '../components/screens/Register/Screen1';
import Screen2 from '../components/screens/Register/Screen2';
import Screen3 from '../components/screens/Register/Screen3';
import CreatePasswordScreen from '../components/screens/Register/CreatePasswordScreen';
const UserNavigation = () => {
    return (
        <UserStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <UserStack.Screen name="Login" component={Login} />
            <UserStack.Screen name="Screen1" component={Screen1} />
            <UserStack.Screen name="Screen2" component={Screen2} />
            <UserStack.Screen name="Screen3" component={Screen3} />
            <UserStack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />

        </UserStack.Navigator>
    )
}

export default UserNavigation