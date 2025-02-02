import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileS = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    superBox: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    all: {
        flex: 1,
        ///backgroundColor: "#f7f7f7",
    },
    h1: {
        width: "100%",
        fontSize: 25,
        //color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',

    },
    avata: {
        width: 120,
        height: 120,
        borderRadius: 20
    },
    box: {
        marginTop: 60,
        alignItems: 'center'
    },
    name: {
        fontSize: 27,
        fontWeight: 'bold',
        //color: 'black',
        marginVertical: 10
    },
    bio: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'gray'
    },
    contact: {
        marginTop: 15
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    h3: {
        color: 'gray',
        marginLeft: 7
    },
    content: {
        marginTop: 20,
        alignItems: 'center'
    },
})

export default ProfileS