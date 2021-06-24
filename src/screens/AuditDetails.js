import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert, BackHandler } from 'react-native'
import { useNavigation, useRoute, useFocusEffect, useCallback } from '@react-navigation/native';
import { CheckBox, Header, Input, Button } from "react-native-elements"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { CustomDropdown } from '../components/core/custom-dropdown'
import { useKeyboard } from '@react-native-community/hooks';
import { FlatList } from 'react-native';
import { CustomCalendar, EditableDropdown, CustomCheckBox, CustomInput, CustomMultiSelectCheckbox, CustomRadioButtonList, CustomTextAreaInput } from "./DynamicControlsScreen"
import _ from "lodash"
import { DynamicGroupsCard } from "../components/dynamic-card"

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
export const AuditDetailsScreen = () => {
    const route = useRoute()
    const { auditDetails, Type, selectedDropdownValue, dropdownObject } = route.params
    const [checkboxValue,setCheckboxValue] = useState( false )
    const [inputValue,setInputValue] = useState( '' )
    const [dropdownvalue,setDropdownValue] = useState( '' )
    const [userInfo,setUserInfo] = useState( {} )
    const [isReset,setIsReset] = useState( false )
    const [shouldShowWarningMessage,setShouldShowWarningMessage] = useState( false )
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const keyboard = useKeyboard()
    const navigation = useNavigation()

    useEffect( ( ) => {
        getUserdetails()
    }, [] )

    
    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }


    const getUserdetails = async () => {
        const user = await fetchUserInfoFromStorage()
        setUserInfo( user )
    }

    const toggleCheckBoxValue = ( ) => {
        setCheckboxValue( checkboxValue => !checkboxValue )
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            _handleBackPress
        );
        return () => backHandler.remove();
    }, [])

    const _handleBackPress = ( ) => {
        // Works on both iOS and Android
        Alert.alert(
          "Discard changes?",
          "Are u sure u want to go back",
          [
            {
              text: "No",
              onPress: () => console.log("No, continue editing")
            },
            {
              text: "Yes",
              onPress: ( ) => navigation.goBack()
            }
          ],
        );
      }

    const onChangeDropdownValue = ( value ) => {
        setDropdownValue( value )
    }

    const renderCustomDropdown = ( ) => {
        const data = auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates.map( item => {
            const currentReportingPeriod = { label: item.Value, value: item.ID }
            return currentReportingPeriod
        })
        return (
            <CustomDropdown
                title="Last Day of Schedule Period"
                value={dropdownvalue}
                onValueChange={onChangeDropdownValue}
                items={data}
            />
        )
    }

    const renderAuditDetailsRow = ( title, value ) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '2%', paddingVertical: '1%', backgroundColor: 'transparent' }}>
                    <Text style={{ paddingHorizontal: '5%', color: 'black', fontSize: 16 }}>{title}</Text>
                    <View style={{ marginHorizontal: '5%' }}>
                        <Text>{value}</Text>
                    </View>      
            </View>
        )
    }



    const renderItem = ( { item } ) => {
        switch( item.ControlType ) {
            case 'TextBox': {
                return (
                   <CustomInput value={item} />
                )
            }
            case 'DropDownList':                               
                return (
                   <EditableDropdown value={item} />
                )
            case 'Calendar':
                return (
                    <CustomCalendar value={item}/>
                )
            case 'Checkbox':
                return (
                    <CustomCheckBox value={item}/>
                )
            case 'CheckBoxList':
                return (
                    <CustomMultiSelectCheckbox value={item} />
                )
            case 'RadioButtonList':
                return (
                    <CustomRadioButtonList value={item} />
                )
            case 'TextArea':
                return (
                    <CustomTextAreaInput value={item}/>
                )
        }
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <View height={24} />
        )
    }

    const renderDynamicFields = ( ) => {
        const SystemFieldsData = _.sortBy(auditDetails.SystemFields?.SystemFields, [function(o) { return o.DisplayOrder; }]);
        return (
            <FlatList 
                data={SystemFieldsData}
                renderItem={renderItem}
                keyExtractor={(item, index) => String( index )}
                contentContainerStyle={{ paddingBottom: 50 }}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        ) 
    }

    const renderDynamicGroupsAndAttributes = ( ) => {
        console.log( JSON.stringify( auditDetails ) )
        const sortedGroupsData = _.sortBy( auditDetails.GroupsAndAttributes?.Groups, ( item ) => item.GroupOrder )
        const shouldShowHazardDetails = auditDetails.AuditAndInspectionDetails?.IsDisplayHazardList
        const shouldShowSourceDetails = auditDetails.AuditAndInspectionDetails?.IsDisplaySource
        const scoreLabel = auditDetails.AuditAndInspectionDetails?.ScoringLable
        return sortedGroupsData.map( item => {
            return (
                <DynamicGroupsCard 
                    dynamicGroups={item}  
                    sourceList={shouldShowSourceDetails ? auditDetails.GroupsAndAttributes.SourceList : [] } 
                    hazardList={shouldShowHazardDetails ? auditDetails.GroupsAndAttributes.HazardList : [] }
                    scoreLabel={scoreLabel}
                    auditAndInspectionId={auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID}
                />
            )
        })
    }

    const onSubmit = async ( ) =>  {
        //
    }

    const renderLastDayOfScheduledPeriod = ( ) => {
        if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" && auditDetails.AuditAndInspectionDetails?.ReportingPeriodDueDates === null ) {
            setShouldShowWarningMessage( true )
            return null
        }else if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" ) {
            return renderCustomDropdown()
        }else{
            return null
        }
    }

    return (
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: _handleBackPress }}
                centerComponent={{ text: 'Inspection Details', style: { color: '#fff', fontSize: 16 } }}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            {
                shouldShowWarningMessage 
                ? (
                    <View>
                       <Text>{auditDetails.AuditAndInspectionDetails?.AdhocWarnigMessage}</Text>
                    </View>
                )
                : null
            }
            {
                renderAuditDetailsRow( 'Record Number:', `${auditDetails.AuditAndInspectionDetails?.AuditAndInspectionNumber}`  )
            }
            <View style={{ backgroundColor: 'transparent'}}>
                <CheckBox
                    title="Select Passing Values for Incomplete Tasks:"
                    checked={checkboxValue}
                    onPress={toggleCheckBoxValue}
                    iconRight={true}
                    textStyle={{ fontSize: 16 ,fontWeight:'500'}}
                    containerStyle={{ paddingLeft: 0 }}
                />
            </View>
            {
                renderAuditDetailsRow( 'Action Taken By:', `${userInfo?.FullName}` )
            }
            {
                renderAuditDetailsRow( `Select ${Type} :`, `${dropdownObject?.Name}` )
            }
            <View style={{ marginTop: '3%', marginHorizontal: '2.2%' }}>
                <Input
                    label="Notes"
                    labelStyle={{ marginBottom: 5, fontWeight: 'bold' }}
                    textAlignVertical="top"
                    placeholder="Type Here"
                    placeholderTextColor="#9EA0A4"
                    inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                    inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                    value={inputValue}
                    onChangeText={(text) => setInputValue( text )}
                />
            </View>
            <View flex={0.5} style={{ marginHorizontal: '2.2%', marginBottom: '3%'}}>
                {
                   renderLastDayOfScheduledPeriod()
                }
            </View>
            {
                !_.isEmpty( auditDetails.AuditAndInspectionDetails.ScheduleFrequency ) 
                ? renderAuditDetailsRow( 'Schedule Frequency:', `${auditDetails.AuditAndInspectionDetails.ScheduleFrequency}` )
                : null
            }
            <View style={{ marginVertical: '3%', marginHorizontal: '2%'}}>
                {
                    renderDynamicFields()
                }
            </View>
            <View>
                {
                    renderDynamicGroupsAndAttributes()
                }
            </View>
            </ScrollView>
        </View>
            {/* <View flex={ keyboard.keyboardShown ? 0.15 : 0.1}>
                <View style={{ marginTop: '3%', marginHorizontal: '4%' }}>
                    <Button containerStyle={{ marginHorizontal: '3%'}}  title="Next" titleStyle={{ fontSize: 18 }} buttonStyle={{ backgroundColor: '#1e5873', width: '100%', padding: 15 }} onPress={onSubmit} />
                </View>
            </View> */}
        </View>
    )
}
