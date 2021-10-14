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
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { result } from 'lodash'


let page = 1
let isLoading = false
let shouldFetch = true
let onEndReachedCalledDuringMomentum = true;

export const AuditAndInspectionScreen = ({ route, navigation }) => {
    const { dashboard, userId, CompanyID } = route.params
    const [auditList,setAuditList] = useState( [] )
    const [templateDetails,setTemplateDetails] = useState( {} )
    const [shouldLoad,setShouldLoad] = useState( false )

    const STATUS_BAR_HEIGHT = getStatusBarHeight()

    useEffect(() => {
        // fetchAuditData( page )
        return () => {
            page = 1,
            isLoading = false,
            shouldFetch = true
        }
    }, [])

    useFocusEffect(
        React.useCallback( () => {
            fetchDataOnPageLoad()
        }, [])
      );

      const fetchDataOnPageLoad = async ( )=> {
          await setShouldLoad(true)
          page = 1
          await setAuditList ([])
          await setTemplateDetails({})
          fetchAuditData(page)
      }

    const fetchAuditData = async ( page ) => {
        const token = await AsyncStorage.getItem('Token')
        isLoading = true
        const body = {
            UserID: userId,
            AccessToken: token,
            CustomFormID: dashboard.CustomFormID,
            AuditAndInspectionTemplateID: dashboard.AuditandInspectionTemplateID,
            PageNumber: String( page )
        }
        const result = await api.post({
            url: 'api/AuditAndInspection/GetHistory',
            body: body
        })
        setTemplateDetails( result.TemplateDetails )
        if( isEmpty( result ) || isEmpty( result.AudiAndInspectionListing ) || result.Message === "No Records Found" || result.Message === "Invalid User Token" || result === undefined ) {
            isLoading = false
            shouldFetch = false
            return null
        }
        setAuditList( auditList => [...auditList, ...result.AudiAndInspectionListing ] )       
        shouldFetch = true
        isLoading = false
        return result;

    }
    const navigateToStartInspection = ( ) => {
        navigation.navigate( 'StartInspection', {
            CustomFormID: dashboard.CustomFormID,
            AuditAndInspectionTemplateID: dashboard.AuditandInspectionTemplateID,
            Title: templateDetails.Title,
            userId: userId,
            AuditAndInspectionFor: templateDetails.AuditAndInspectionFor,
            Type: templateDetails.Type
        } )
    }

    const onEditInspection = async ( auditId ) => {
        if( auditId === null || auditId === undefined ) {
            return null
        }
        const token = await AsyncStorage.getItem('Token')
        isLoading = true
        const body = {
            UserID: userId,
            AccessToken: token,
            CustomFormID: dashboard.CustomFormID,
            AuditAndInspectionTemplateID: dashboard.AuditandInspectionTemplateID,
            AuditAndInspectionID: auditId,
            CompanyID: CompanyID
        }
        const result = await api.post({
            url: 'api/AuditAndInspection/GetAuditDetails',
            body: body
        })
        console.log( 'response on edit inspection ',JSON.stringify( result ) )
        if( isEmpty( result ) ) {
            isLoading = false
            navigatetoBackScreen()
            return null
        }else{
            navigation.navigate( 'EditAuditDetails', {
                auditDetails: result,
                Type: templateDetails.Type,
                selectedDropdownValue: userId,
                dropdownObject: "",
                PrimaryUserID: userId,
                AuditAndInspectionTemplateID: dashboard.AuditandInspectionTemplateID
            } )
        }

    }

    const renderItem = ( { item } ) => {
        return(
            <AuditCard audit={item} templateDetails={templateDetails} onEditInspection={onEditInspection} />
        )
    }

    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }

    const loadMoreResults = ( ) => {
        if( shouldFetch && !onEndReachedCalledDuringMomentum ) {
            page = page + 1
            setShouldLoad( true )
            fetchAuditData( page )
            onEndReachedCalledDuringMomentum = true
        }
    } 

    const ListFooterComponent = ( ) => {
        if( shouldFetch && !onEndReachedCalledDuringMomentum ) {
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
               <Text>No audit/inspection history found</Text>
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
                        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
                        keyExtractor={ (item,index) => String( index ) }
                        renderItem={renderItem}
                        onEndReached={loadMoreResults}
                        ListEmptyComponent={ListEmptyComponent}
                        onEndReachedThreshold={0.01}
                        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                        ListFooterComponent={ListFooterComponent}
                    />
                    <View style={{position: 'absolute', bottom: "15%", right: 10, top: '90%', left: '85%'}}>
                        <Avatar size="medium" onPress={navigateToStartInspection} rounded icon={{ name: 'add'}} containerStyle={{ backgroundColor: '#1e5873'}}/>
                    </View>
                </View>
            </View>
        )
}
