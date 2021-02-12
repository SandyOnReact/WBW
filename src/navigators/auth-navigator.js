import React from 'react'
import { LoginScreen } from '../screens/Login';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

export const AuthenticationNavigator = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: '#1e5873'
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 18
                    },
                }}
                name="Login"
                component={LoginScreen} />
        </Stack.Navigator>
    )
}
