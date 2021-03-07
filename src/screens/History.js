import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import { Async } from 'react-async'
import { View, ActivityIndicator } from 'react-native'
import { Header, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { api } from '../utils/api'
import { HistoryCard } from '../components/history-card'


export const HistoryScreen = ({ route, navigation }) => {
    const { userId, levelId, category, dashboard } = route.params
    const [historyList,setHistoryList] = useState( [] )
    const [page,setPage] = useState( 1 )
    const [isLoading, setIsLoading] = useState( false )

    const STATUS_BAR_HEIGHT = getStatusBarHeight()

    useEffect(()=> {
        fetchHistoryData()
    }, [] )

    const fetchHistoryData = useCallback(async () => {
        const token = await AsyncStorage.getItem('Token')
        setIsLoading( true )
        const result = await api.post({
            url: 'api/Observation/GetObservationHistory_WithPaging',
            body: {
                UserID: userId,
                AccessToken: token,
                LevelID: levelId,
                PageNumber: String( page )
            }
        })
        // setHistoryList( historyList => [...historyList, ...result ] )
        setHistoryList( result )
        setIsLoading( false )
        return result;
    }, [page])
    const navigateToAddObservation = ( ) => {
        navigation.navigate( 'AddObservation',{
            dashboard: dashboard,
            userId: userId
        } )
    }

    const renderItem = ( { item } ) => {
        return(
            <HistoryCard history={item} />
        )
    }

    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }

    const loadMoreResults = useCallback( ( ) => {
        setPage( page => page + 1 )
    }, [fetchHistoryData] )

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="red"/>
            </View>
        )
    }
    return (
            <View style={{ flex: 1 }}>
                <Header
                    containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                    statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                    containerStyle={{ backgroundColor: '#1e5873' }}
                    leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                    centerComponent={{ text: category, style: { color: '#fff' ,fontWeight:'bold', fontSize:16} }}
                />
                <View>
                    <FlatList 
                        data={historyList}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        keyExtractor={ (item,index) => String( index )}
                        renderItem={renderItem}
                        onEndReached={loadMoreResults}
                        onEndReachedThreshold={0.8}
                    />
                    <View style={{position: 'absolute', bottom: "15%", right: 10, top: '80%', left: '85%'}}>
                        <Avatar size="medium" onPress={navigateToAddObservation} rounded icon={{ name: 'add'}} containerStyle={{ backgroundColor: '#1e5873'}}/>
                    </View>
                </View>
            </View>
        )
}
