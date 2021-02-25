import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, BackHandler, Alert } from 'react-native'
import Async from 'react-async';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import { DashboardCard } from '../components/dashboard-card'
import { Divider, Header } from 'react-native-elements'
import { CommonActions } from '@react-navigation/native';


export const HomeScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({})

    /**
     *  handling back handler 
     *  Whenever user does hardware back press, exit App instead if navigating to back screen.
     */
    // useEffect(() => {
    //     const backAction = () => {
    //         Alert.alert("Hold on!", "Are you sure you want to Exit App?", [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => null,
    //                 style: "cancel"
    //             },
    //             { text: "YES", onPress: () => BackHandler.exitApp() }
    //         ]);
    //         return true;
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         backAction
    //     );

    //     return () => backHandler.remove();
    // }, []);

    /**
    *  Fetch object as a string
    *  & then convert that string to object again.
    */
    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    const fetchApi = useCallback(async () => {

        const user = await fetchUserInfoFromStorage()
        setUserInfo(user)
        const token = await AsyncStorage.getItem('Token')

        const result = await api.post({
            url: `api/Dashboard/getDashboardLink`,
            body: {
                UserID: user.UserID,
                AccessToken: token
            }
        })
        if (result === "Invalid User Token") {
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Login' }
                  ],
                })
              );
        }
        return result;
    }, [])

    const onDashboardPress = (dashboard) => {
        navigation.navigate('History', {
            userId: userInfo.UserID,
            levelId: userInfo.LevelID,
            category: dashboard.Category
        })
    }

    const renderItem = ({ item }) => {
        return (
            <DashboardCard
                dashboard={item}
                onDashboardPress={onDashboardPress}
            />
        )
    }

    const ItemSeparatorComponent = () => {
        return (
            <Divider style={{ height: 10, backgroundColor: 'lightGray' }} />
        )
    }

    return (
        <Async promiseFn={fetchApi}>
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
                {list => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Header
                                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                                leftComponent={{ icon: 'menu', color: '#fff' }}
                                containerStyle={{ backgroundColor: '#1e5873' }}
                                centerComponent={{ text: userInfo.CompanyName, style: { color: '#fff',fontWeight:'bold', fontSize:16 } }}
                            />
                            <View style={{margin:20}}>
                                <FlatList
                                    data={list}
                                    ItemSeparatorComponent={ItemSeparatorComponent}
                                    keyExtractor={(item, index) => String(index)}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ paddingBottom: 30 }}
                                />
                            </View>
                        </View>
                    )
                }}
            </Async.Resolved>
        </Async>

    )
}

