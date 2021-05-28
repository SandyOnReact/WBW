import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Platform, ActivityIndicator, BackHandler } from "react-native";
import { AuthenticationNavigator } from './auth-navigator'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { ApplicationNavigator } from "./application-navigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen } from '../screens/Home'
import { LoginScreen } from '../screens/Login'
import { HistoryScreen } from '../screens/History'
import { AddObservationScreen } from '../screens/AddObservation'
import{UploadImageScreen} from '../screens/UploadImage'
import{CropImageScreen} from '../screens/CropImage'
import { DynamicControlsScreen } from '../screens/DynamicControlsScreen'
import { AuditAndInspectionScreen } from '../screens/AuditAndInspectionScreen'
import { StartInspection } from "../screens/StartInspection"
import { AuditDetailsScreen } from "../screens/AuditDetails"

//TODO: implement Authorization flow and move auth screens to Auth Navigator and Application Navigator.
export const RootNavigator = ( ) => {

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
                <Stack.Screen name="DynamicControls" component={DynamicControlsScreen} />
                <Stack.Screen name="AuditAndInspectionScreen" component={AuditAndInspectionScreen} />
                <Stack.Screen name="StartInspection" component={StartInspection} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="AddObservation" component={AddObservationScreen} />
                <Stack.Screen name="UploadImage" component={UploadImageScreen} />
                <Stack.Screen name="CropImage" component={CropImageScreen} />
                <Stack.Screen name="AuditDetails" component={AuditDetailsScreen} />
            </Stack.Navigator>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.95 }}>
                {/* {token ? <ApplicationNavigator /> : <AuthenticationNavigator />} */}
                { fetchAllScreens() }
            </View>
            <View style={{ flex: 0.05, backgroundColor: '#1e5873', justifyContent: 'center', opacity: 0.8 , alignItems: 'center' }}>
                <Text style={{ color: 'white'}}>Copyright © Wise Businessware. All rights reserved.</Text>
            </View>
        
        </View>

    )
}

