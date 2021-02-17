import React from 'react'
import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const AddObservationScreen = ( { navigation } ) => {
    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }
    const STATUS_BAR_HEIGHT = getStatusBarHeight()


    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "dark-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Add Observation', style: { color: '#fff' } }}
            />
        </View>
    )
}
