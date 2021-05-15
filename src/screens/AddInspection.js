import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Header, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { api } from '../utils/api'
import { AuditCard } from '../components/audit-card'
import { isEmpty } from 'lodash'
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CustomDropdown } from '../components/core/custom-dropdown'


export const AddInspection = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { CustomFormID, AuditAndInspectionTemplateID, Title, userId } = route.params
    const [primaryDropdownArray, setPrimaryDropdownArray] = useState( [] )
    const [secondaryDropdownArray, setSecondaryDropdownArray] = useState( [] )
    const [selectedPrimaryDropdownValue,setSelectedPrimaryDropdownvalue] = useState( '' )
    const [isLoading,setIsLoading] = useState( false )
    const STATUS_BAR_HEIGHT = getStatusBarHeight()


    useEffect( ( ) => {
        fetchTypes()
    }, [] )

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
        const primaryArray = result.map(item => {
            if( item.IsDefault === "True" ) {
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
    }

    if( isLoading ) {
        return null
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
                <Text style={{ textAlign: 'center', fontSize: 18 }}>Select Area that you want to audit and click start audit button</Text>
            </View>
            <View style={{ flex: 1, marginTop: '3%'}}>
                <CustomDropdown
                    title="Select Area"
                    items={primaryDropdownArray}
                    value={selectedPrimaryDropdownValue}
                    onValueChange={onPrimaryDropdownValueChange}
                />
            </View>
        </View>
    )
}

