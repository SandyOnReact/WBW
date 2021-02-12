import React from 'react'
import { View, Text, Dimensions } from "react-native";
import { AuthenticationNavigator } from './auth-navigator'
import { NavigationContainer } from '@react-navigation/native'
import { ApplicationNavigator } from "./application-navigator";
import { useKeyboard } from "@react-native-community/hooks";


export const RootNavigator = (props) => {


    const token = undefined;
    const keyboard = useKeyboard();

    return (
        <View style={{ flex: 1}}>
            <View style={{ flex: 0.9 }}>
                {token ? <ApplicationNavigator /> : <AuthenticationNavigator />}
            </View>
            <View style={{ flex: 0.1, marginVertical: '2%', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Copyright © Wise Businessware. All rights reserved.</Text>
            </View>
            {keyboard.keyboardShown 
            ? <View style={{ width: Dimensions.get('window').width,  height: keyboard.keyboardHeight }} />
            : null
            }
        </View>

    )
}

