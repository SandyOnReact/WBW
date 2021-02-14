import React from 'react'
import { View, Text } from 'react-native'
import { Header } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const HistoryScreen = ({ route }) => {
    const { historyData } = route.params
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "dark-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                centerComponent={{ text: historyData.Category, style: { color: '#fff' } }}
            />
        </View>
    )
}
