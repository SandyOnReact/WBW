import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { api } from '../utils/api'
import { isEmpty } from 'lodash'
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CustomDropdown } from '../components/core/custom-dropdown'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';


export const StartInspection = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { CustomFormID, AuditAndInspectionTemplateID, Title, userId, AuditAndInspectionFor, Type } = route.params
    const [data, setData] = useState( [] )
    const [dropdownObject, setDropdownObject] = useState( {} )
    const [primaryDropdownArray, setPrimaryDropdownArray] = useState( [] )
    const [secondaryDropdownArray, setSecondaryDropdownArray] = useState( [] )
    const [selectedPrimaryDropdownValue,setSelectedPrimaryDropdownvalue] = useState( '' )
    const [selectedSecondaryDropdownValue,setSelectedSecondaryDropdownvalue] = useState( '' )
    const [isLoading,setIsLoading] = useState( false )
    const STATUS_BAR_HEIGHT = getStatusBarHeight()


    useFocusEffect(
        React.useCallback(() => {
            fetchTypes()
        }, [])
      );

    const fetchTypes = async ( ) => {
        setIsLoading( true )
        const token = await AsyncStorage.getItem('Token')
        const body = {
            UserID: userId,
            AccessToken: token,
            CustomFormID: CustomFormID,
            AuditAndInspectionTemplateID: AuditAndInspectionTemplateID,
        }
        const result = await api.post({
            url: 'api/AuditAndInspection/GetTypes',
            body: body
        })
        if( isEmpty( result ) ) {
            return null
        }
        setData( result )
        const primaryArray = result.map(item => {
            setDropdownObject( item )
            if( item.IsDefault === "True" && !isEmpty( item.PrimaryUserList ) ) {
                setSelectedPrimaryDropdownvalue( item.TypeID )
                const nestedDropdown = item.PrimaryUserList.map( val => {
                    const secondaryObject = { label: val.Name, value: val.ID }
                    return secondaryObject;
                })
                setSecondaryDropdownArray( nestedDropdown )
            }else if( item.IsDefault === "True" ) {
                setSelectedPrimaryDropdownvalue( item.TypeID )
            } 
            
            const primaryObject = { label: item.Name, value: item.TypeID }
            return primaryObject;
        }, [])
        setPrimaryDropdownArray( primaryArray ) 
        setIsLoading( false )
    }

    const navigatetoBackScreen = ( ) => {
        navigation.goBack()
    }

    const onPrimaryDropdownValueChange = ( value ) => {
        setSelectedPrimaryDropdownvalue( value )
        const selectedObject = data.find( item => String( item.TypeID ) === String( value ))
       if( !isEmpty( selectedObject.PrimaryUserList ) ) {
         const nestedDropdown = selectedObject.PrimaryUserList.map( val => {
                const secondaryObject = { label: val.Name, value: val.ID }
                return secondaryObject;
            })
            setSecondaryDropdownArray( nestedDropdown )
       }else{
           setSecondaryDropdownArray( [] )
       }
    }

    const onSecondaryDropdownValueChange = ( value ) => {
        setSelectedSecondaryDropdownvalue( value )
    }

    const navigateToAuditDetails = ( auditDetails, PrimaryUserID ) => {
        navigation.navigate( 'AuditDetails', {
            auditDetails: auditDetails,
            Type: Type,
            selectedDropdownValue: isEmpty( selectedSecondaryDropdownValue ) ? userId : selectedSecondaryDropdownValue,
            dropdownObject: dropdownObject,
            PrimaryUserID: PrimaryUserID,
            AuditAndInspectionTemplateID: AuditAndInspectionTemplateID
        } )
    }

    const onSubmit = async ( ) =>  {
        setIsLoading( true )
        const token = await AsyncStorage.getItem('Token')
        const PrimaryUserID = isEmpty( selectedSecondaryDropdownValue ) ? userId : selectedSecondaryDropdownValue
        const body = {
            UserID: userId,
            AccessToken: token,
            CustomFormID: CustomFormID,
            AuditAndInspectionTemplateID: AuditAndInspectionTemplateID,
            TypeID: selectedPrimaryDropdownValue,
            PrimaryUserID: PrimaryUserID,
            Type: Type
        }
        const result = await api.post({
            url: 'api/AuditAndInspection/StartAudit',
            body: body
        })
        if( isEmpty( result ) ) {
            Toast.showWithGravity('Something went wrong', Toast.LONG, Toast.CENTER);
            return null
        } 
        navigateToAuditDetails( result, PrimaryUserID )
    }

    if( isLoading ) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="red" size={32} />
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
                centerComponent={{ text: Title, style: { color: '#fff' ,fontWeight:'bold', fontSize:16} }}
            />
            <View style={{ marginTop: '3%', marginHorizontal: '3%'}}>
                <Text style={{ textAlign: 'center', fontSize: 18 }}>{`Select ${Type} that you want to audit and click start audit button`}</Text>
            </View>
            <View style={{ flex: isEmpty( secondaryDropdownArray ) ?  0.15 : 0.3, marginTop: '3%' }}>
                <CustomDropdown
                    title={`Select ${Type}`}
                    items={primaryDropdownArray}
                    value={selectedPrimaryDropdownValue}
                    onValueChange={onPrimaryDropdownValueChange}
                />
                {
                    !isEmpty( secondaryDropdownArray )
                    ?
                    <CustomDropdown
                        title="Inspection on behalf of"
                        items={secondaryDropdownArray}
                        value={selectedSecondaryDropdownValue}
                        onValueChange={onSecondaryDropdownValueChange}
                    />
                    : null
                }
            </View>
            <View style={{ marginTop: '3%' }}>
                <Button containerStyle={{ marginHorizontal: '3%'}}  title="Start" titleStyle={{ fontSize: 18 }} buttonStyle={{ backgroundColor: '#1e5873', width: '100%', padding: 15 }} onPress={onSubmit} loading={isLoading}/>
            </View>
        </View>
    )
}

