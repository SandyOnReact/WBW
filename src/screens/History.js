import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback } from 'react'
import { Async } from 'react-async'
import { View, ActivityIndicator } from 'react-native'
import { Header } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { api } from '../utils/api'
import { HistoryCard } from '../components/history-card'
import { NavigationContainer } from '@react-navigation/native'


export const HistoryScreen = ({ route, navigation }) => {
    const { userId, levelId, category } = route.params

    const STATUS_BAR_HEIGHT = getStatusBarHeight()

    const fetchHistoryData = useCallback(async () => {

        const token = await AsyncStorage.getItem('Token')

        const result = await api.post({
            url: 'api/Observation/GetObservationHistory_WithPaging',
            body: {
                UserID: userId,
                AccessToken: token,
                LevelID: levelId,
                PageNumber: "1"
            }
        })

        return result;

    }, [])

    const renderItem = ( { item } ) => {
        return(
            <HistoryCard history={item} />
        )
    }

    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }

    return (
        <Async promiseFn={fetchHistoryData}>
            <Async.Pending>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color='red' />
                </View>
            </Async.Pending>
            <Async.Rejected>
                {(error) => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{error.reason || error.message || 'Something went wrong while trying to fetch'}</Text>
                    </View>
                )}
            </Async.Rejected>
            <Async.Resolved>
                {data => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Header
                                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                                statusBarProps={{ barStyle: "dark-content", translucent: true, backgroundColor: "transparent" }}
                                containerStyle={{ backgroundColor: '#1e5873' }}
                                leftComponent={{ name: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                                centerComponent={{ text: category, style: { color: '#fff' } }}
                            />
                            <View>
                                <FlatList 
                                    data={data}
                                    contentContainerStyle={{ paddingBottom: 80 }}
                                    keyExtractor={ (item,index) => String( index )}
                                    renderItem={renderItem}
                                />
                            </View>
                        </View>
                    )
                }}
            </Async.Resolved>
        </Async>
    )
}
