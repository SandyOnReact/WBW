import React from 'react'
import { View, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Header } from "react-native-elements"

export const CompleteOrAssignTask = () => {
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()

    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Complete or Assign Task', style: { color: '#fff', fontSize: 16 } }}
            />        
            </View>
    )
}

