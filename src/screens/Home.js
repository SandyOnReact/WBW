import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'


export const HomeScreen = () => {

    useEffect(()=> {
        getUserInfo()
    }, [] )

    /**
     *  Fetch object as a string
     *  & then convert that string to object again.
     */
    const fetchUserInfoFromStorage = async ( ) => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;    
    }

    const getUserInfo = async ( ) => {
        const user = await fetchUserInfoFromStorage()
    }

    return (
        <View flex={1} style={{ justifyContent:'center', alignItems: 'center'}}>
            <Text>Home Screen</Text> 
        </View>
    )
}

