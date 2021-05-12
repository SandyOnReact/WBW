import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import { Async } from 'react-async'
import { View, ActivityIndicator, Text } from 'react-native'
import { Header, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { api } from '../utils/api'
import { AuditCard } from '../components/audit-card'
import { isEmpty } from 'lodash-es'

let page = 1
let isLoading = false
let shouldFetch = true
let onEndReachedCalledDuringMomentum = true;

// const templateDetails = {
//     "AuditAndInspectionFor": "Vehicle",
//     "Title": "Audit For Vehicle"
// }

// const AudiAndInspectionListing = [
//     {
//         "LinkText": "View",
//         "FullName": "xyz, admin",
//         "RecordNumber": "AFV-V1-2021-0005",
//         "LastDayOfSchedulePeriod": "04/30/2021",
//         "Status": "Complete",
//         "Tasks": "No",
//         "IsOutstandingTaskRequired": "No",
//         "AuditAndInspectionFor": "Vehicle 1",
//         "Work_Site_Name_Value": "",
//         "AuditAndInspectionID": "285",
//         "AddDateTime": "4/30/2021 6:03:35 PM",
//         "CompletedDateTime": "4/30/2021 6:03:37 PM"
//     },
//     {
//         "LinkText": "View",
//         "FullName": "xyz, admin",
//         "RecordNumber": "AFV-V1-2021-0004",
//         "LastDayOfSchedulePeriod": "04/27/2021",
//         "Status": "Complete",
//         "Tasks": "No",
//         "IsOutstandingTaskRequired": "No",
//         "AuditAndInspectionFor": "Vehicle 1",
//         "Work_Site_Name_Value": "",
//         "AuditAndInspectionID": "284",
//         "AddDateTime": "4/27/2021 3:40:50 PM",
//         "CompletedDateTime": "4/27/2021 3:40:52 PM"
//     },
//     {
//         "LinkText": "View",
//         "FullName": "xyz, admin",
//         "RecordNumber": "AFV-V2-2021-0001",
//         "LastDayOfSchedulePeriod": "04/23/2021",
//         "Status": "Complete",
//         "Tasks": "No",
//         "IsOutstandingTaskRequired": "No",
//         "AuditAndInspectionFor": "Vehicle 2",
//         "Work_Site_Name_Value": "",
//         "AuditAndInspectionID": "283",
//         "AddDateTime": "4/23/2021 3:03:26 PM",
//         "CompletedDateTime": "4/23/2021 3:03:27 PM"
//     },
//     {
//         "LinkText": "View",
//         "FullName": "xyz, admin",
//         "RecordNumber": "AFV-V1-2021-0002",
//         "LastDayOfSchedulePeriod": "04/22/2021",
//         "Status": "Complete",
//         "Tasks": "No",
//         "IsOutstandingTaskRequired": "No",
//         "AuditAndInspectionFor": "Vehicle 1",
//         "Work_Site_Name_Value": "",
//         "AuditAndInspectionID": "282",
//         "AddDateTime": "4/22/2021 1:14:50 PM",
//         "CompletedDateTime": "4/22/2021 1:14:52 PM"
//     },
//     {
//         "LinkText": "Edit",
//         "FullName": "xyz, admin",
//         "RecordNumber": "AFV-V1-2021-0001",
//         "LastDayOfSchedulePeriod": "04/21/2021",
//         "Status": "In Process",
//         "Tasks": "No",
//         "IsOutstandingTaskRequired": "No",
//         "AuditAndInspectionFor": "Vehicle 1",
//         "Work_Site_Name_Value": "",
//         "AuditAndInspectionID": "281",
//         "AddDateTime": "4/21/2021 3:33:42 PM",
//         "CompletedDateTime": ""
//     }
// ]

const data = {
    TemplateDetails: {
        "AuditAndInspectionFor": "Vehicle",
        "Title": "Audit For Vehicle"
    },
    AudiAndInspectionListing: [
        {
            "LinkText": "View",
            "FullName": "xyz, admin",
            "RecordNumber": "AFV-V1-2021-0005",
            "LastDayOfSchedulePeriod": "04/30/2021",
            "Status": "Complete",
            "Tasks": "No",
            "IsOutstandingTaskRequired": "No",
            "AuditAndInspectionFor": "Vehicle 1",
            "Work_Site_Name_Value": "",
            "AuditAndInspectionID": "285",
            "AddDateTime": "4/30/2021 6:03:35 PM",
            "CompletedDateTime": "4/30/2021 6:03:37 PM"
        },
        {
            "LinkText": "View",
            "FullName": "xyz, admin",
            "RecordNumber": "AFV-V1-2021-0004",
            "LastDayOfSchedulePeriod": "04/27/2021",
            "Status": "Complete",
            "Tasks": "No",
            "IsOutstandingTaskRequired": "No",
            "AuditAndInspectionFor": "Vehicle 1",
            "Work_Site_Name_Value": "",
            "AuditAndInspectionID": "284",
            "AddDateTime": "4/27/2021 3:40:50 PM",
            "CompletedDateTime": "4/27/2021 3:40:52 PM"
        },
        {
            "LinkText": "View",
            "FullName": "xyz, admin",
            "RecordNumber": "AFV-V2-2021-0001",
            "LastDayOfSchedulePeriod": "04/23/2021",
            "Status": "Complete",
            "Tasks": "No",
            "IsOutstandingTaskRequired": "No",
            "AuditAndInspectionFor": "Vehicle 2",
            "Work_Site_Name_Value": "",
            "AuditAndInspectionID": "283",
            "AddDateTime": "4/23/2021 3:03:26 PM",
            "CompletedDateTime": "4/23/2021 3:03:27 PM"
        },
        {
            "LinkText": "View",
            "FullName": "xyz, admin",
            "RecordNumber": "AFV-V1-2021-0002",
            "LastDayOfSchedulePeriod": "04/22/2021",
            "Status": "Complete",
            "Tasks": "No",
            "IsOutstandingTaskRequired": "No",
            "AuditAndInspectionFor": "Vehicle 1",
            "Work_Site_Name_Value": "",
            "AuditAndInspectionID": "282",
            "AddDateTime": "4/22/2021 1:14:50 PM",
            "CompletedDateTime": "4/22/2021 1:14:52 PM"
        },
        {
            "LinkText": "Edit",
            "FullName": "xyz, admin",
            "RecordNumber": "AFV-V1-2021-0001",
            "LastDayOfSchedulePeriod": "04/21/2021",
            "Status": "In Process",
            "Tasks": "No",
            "IsOutstandingTaskRequired": "No",
            "AuditAndInspectionFor": "Vehicle 1",
            "Work_Site_Name_Value": "",
            "AuditAndInspectionID": "281",
            "AddDateTime": "4/21/2021 3:33:42 PM",
            "CompletedDateTime": ""
        }
    ]
}


export const AuditAndInspectionScreen = ({ route, navigation }) => {
    const { dashboard, userId } = route.params
    const [auditList,setAuditList] = useState( [] )
    const [templateDetails,setTemplateDetails] = useState( {} )

    const STATUS_BAR_HEIGHT = getStatusBarHeight()

    useEffect(() => {
        fetchAuditData( page )
        return () => {
            page = 1,
            isLoading = false,
            shouldFetch = true
        }
    }, [ page ])

    // const fetchAuditData = async ( page ) => {
    //     const token = await AsyncStorage.getItem('Token')
    //     isLoading = true
    //     const result = await api.post({
    //         url: 'api/AuditAndInspection/GetHistory',
    //         body: {
    //             UserID: userId,
    //             AccessToken: token,
    //             CustomFormID: dashboard.CustomFormID,
    //             AuditAndInspectionTemplateID: dashboard.AuditAndInspectionTemplateID,
    //             PageNumber: String( page )
    //         }
    //     })
    //     if( isEmpty( result ) || isEmpty( result.AudiAndInspectionListing ) || result.Message === "No Records Found" || result.Message === "Invalid User Token" || result === undefined ) {
    //         isLoading = false
    //         shouldFetch = false
    //         setAuditList( [] )
    //         return null
    //     }
    //     setAuditList( auditList => [...auditList, result.AudiAndInspectionListing ] )
    //     setTemplateDetails( result.TemplateDetails )
    //     shouldFetch = true
    //     isLoading = false
    //     return result;
    // }
    const fetchAuditData = async ( page ) => {
        const token = await AsyncStorage.getItem('Token')
        isLoading = true
        const result = await api.post({
            url: 'api/AuditAndInspection/GetHistory',
            body: {
                UserID: userId,
                AccessToken: token,
                CustomFormID: dashboard.CustomFormID,
                AuditAndInspectionTemplateID: dashboard.AuditandInspectionTemplateID,
                PageNumber: String( page )
            }
        })
        if( isEmpty( result ) || isEmpty( result.AudiAndInspectionListing ) || result.Message === "No Records Found" || result.Message === "Invalid User Token" || result === undefined ) {
            isLoading = false
            shouldFetch = false
            return null
        }
        setAuditList( auditList => [...auditList, ...result.AudiAndInspectionListing ] )
        setTemplateDetails( result.TemplateDetails )
        shouldFetch = true
        isLoading = false
        return result;

    }
    const navigateToAddInspection = ( ) => {
        navigation.navigate( 'AddInspection' )
    }

    const renderItem = ( { item } ) => {
        return(
            <AuditCard audit={item} templateDetails={templateDetails}/>
        )
    }

    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }

    const loadMoreResults = ( ) => {
        console.log( 'loading more -->')
        if( shouldFetch && !onEndReachedCalledDuringMomentum ) {
            page = page + 1
            fetchAuditData( page )
            onEndReachedCalledDuringMomentum = true
        }
    } 

    const ListFooterComponent = ( ) => {
        if( isLoading ) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="red"/>
                </View>
            )
        }else{
            return null
        }
    }

    const ListEmptyComponent = ( ) => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No audit records found</Text>
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
                    centerComponent={{ text: dashboard.Category, style: { color: '#fff' ,fontWeight:'bold', fontSize:16} }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList 
                        data={auditList}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        keyExtractor={ (item,index) => String( index )}
                        renderItem={renderItem}
                        onEndReached={loadMoreResults}
                        ListEmptyComponent={ListEmptyComponent}
                        onEndReachedThreshold={0.01}
                        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                        ListFooterComponent={ListFooterComponent}
                    />
                    <View style={{position: 'absolute', bottom: "15%", right: 10, top: '90%', left: '85%'}}>
                        <Avatar size="medium" onPress={navigateToAddInspection} rounded icon={{ name: 'add'}} containerStyle={{ backgroundColor: '#1e5873'}}/>
                    </View>
                </View>
            </View>
        )
}
