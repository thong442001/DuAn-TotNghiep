import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '../../assets/context/ThemeContext'
import colors from '../../assets/colors'
const Notification = () => {
    const {theme} = useContext(ThemeContext)
    const activeColors = colors[theme.mode]
    return (
        <SafeAreaView style={{backgroundColor : activeColors.tertiary, flex: 1}}>
            <Text>Notification</Text>
        </SafeAreaView>
    )
}

export default Notification

const styles = StyleSheet.create({})


