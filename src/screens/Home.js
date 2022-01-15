import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, BackHandler, Alert, Linking } from 'react-native'
import Async from 'react-async';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import { DashboardCard } from '../components/dashboard-card'
import { Divider, Header } from 'react-native-elements'
import { CommonActions } from '@react-navigation/native';
import { isEmpty, sortBy } from 'lodash-es';
import { InAppBrowser } from "react-native-inappbrowser-reborn"


export const HomeScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({})

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    const fetchApi = useCallback(async () => {

        const user = await fetchUserInfoFromStorage()
        setUserInfo(user)
        const token = await AsyncStorage.getItem('Token')
        let result = await api.post({
            url: `api/Dashboard/getDashboardLink`,
            body: {
                UserID: user.UserID,
                AccessToken: token
            }
        })
        result = sortBy( result, ( item ) => item.HomePageOrder )
        if ( isEmpty(result ) || result.Message === "Invalid User Token") {
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

    const openInAppBrowser = async ( ) => {
        try {
            const token = await AsyncStorage.getItem('Token')
            const url = `http://198.71.63.116/MySite/Dashboard.aspx?dp=1&U=${userInfo.UserID}&T=${token}`
            if (await InAppBrowser.isAvailable()) {
              const result = await InAppBrowser.openAuth(url, {
                // iOS Properties
                dismissButtonStyle: 'cancel',
                preferredBarTintColor: '#1e5873',
                preferredControlTintColor: 'white',
                readerMode: false,
                animated: true,
                modalPresentationStyle: 'fullScreen',
                modalTransitionStyle: 'coverVertical',
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: '#1e5873',
                secondaryToolbarColor: 'black',
                navigationBarColor: 'black',
                navigationBarDividerColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                  startEnter: 'slide_in_right',
                  startExit: 'slide_out_left',
                  endEnter: 'slide_in_left',
                  endExit: 'slide_out_right'
                },
                headers: {
                  'my-custom-header': 'my custom header value'
                }
              })
            }
            else Linking.openURL(url)
          } catch (error) {
              console.log( 'error is ',JSON.stringify( error ) )
            Alert.alert(error.message)
          }
    }

    const onDashboardPress = (dashboard) => {
        if( dashboard.Category === "POC" ) {
            // navigation.navigate( 'Webview', {
            //     dashboard: dashboard
            // } )
            openInAppBrowser()
        }else if( dashboard.Type === "Audit-originator" ) {
            navigation.navigate( 'AuditAndInspectionScreen', {
                dashboard: dashboard,
                userId: userInfo.UserID,
                CompanyID: userInfo.CompanyID
            } )
        }
        else{         
            navigation.navigate('History', {
                userId: userInfo.UserID,
                levelId: userInfo.LevelID,
                category: dashboard.Category,
                dashboard: dashboard
            })
        }
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

    const onLogout = async ( ) => {
        await AsyncStorage.clear()
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Login' }
              ],
            })
          );
    }

    const onRightIconPress = ( ) => {
        Alert.alert(
            "Logout?",
            "Are you sure you want to logout?",
            [
              {
                text: "No",
                onPress: () => null
              },
              {
                text: "Yes",
                onPress: ( ) => onLogout()
              }
            ],
          );
          return true
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
                                // leftComponent={{ icon: 'menu', color: '#fff' }}
                                containerStyle={{ backgroundColor: '#1e5873' }}
                                centerComponent={{ text: userInfo.CompanyName, style: { color: '#fff',fontWeight:'bold', fontSize:16 } }}
                                rightComponent={{ icon: 'logout', color: '#fff', type: 'material', onPress: onRightIconPress }}
                                rightContainerStyle={{ marginHorizontal: '2%'}}
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

