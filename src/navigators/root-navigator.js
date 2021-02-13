import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Platform, ActivityIndicator } from "react-native";
import { AuthenticationNavigator } from './auth-navigator'
import { NavigationContainer } from '@react-navigation/native'
import { ApplicationNavigator } from "./application-navigator";
import { useKeyboard } from "@react-native-community/hooks";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen } from '../screens/Home'
import { LoginScreen } from '../screens/Login'

//TODO: implement Authorization flow and move auth screens to Auth Navigator and Application Navigator.
export const RootNavigator = (props) => {

    const [token, setToken] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        try {
            const userToken = await AsyncStorage.getItem('Token')
            setToken(userToken)
            setIsLoading(false)
        } catch (e) {
            // read error
        }
    }
    const keyboard = useKeyboard();
    const Stack = createStackNavigator();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='red' />
            </View>
        )
    }

    const fetchAllScreens = () => {
        return (
            <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'} headerMode='none'>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.9 }}>
                {/* {token ? <ApplicationNavigator /> : <AuthenticationNavigator />} */}
                { fetchAllScreens() }
            </View>
            <View style={{ flex: 0.1, marginVertical: '2%', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Copyright © Wise Businessware. All rights reserved.</Text>
            </View>
            {Platform.os === 'ios' && keyboard.keyboardShown
                ? <View style={{ width: Dimensions.get('window').width, height: keyboard.keyboardHeight }} />
                : null
            }
        </View>

    )
}

