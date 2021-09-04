import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert, BackHandler, Image } from 'react-native'
import { useNavigation, useRoute, useFocusEffect, useCallback } from '@react-navigation/native';
import { CheckBox, Header, Input, Button, Avatar } from "react-native-elements"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { CustomDropdown } from '../components/core/custom-dropdown'
import { useKeyboard } from '@react-native-community/hooks';
import { FlatList } from 'react-native';
import { CustomMultiSelectCheckbox } from "./DynamicControlsScreen"
import _, { clone, isEmpty, omit } from "lodash"
import { DynamicGroupsCard } from "../components/dynamic-card"
import lodash from "lodash"
import { api } from '../utils/api'
import Toast from "react-native-simple-toast"


const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

export const CustomInput = ( { value, isRequired, onInputValueChange } ) => {
    const [inputValue,setInputValue] = useState( value.SelectedValue )

    const onChangeText = ( value ) => {
        setInputValue( value )
        onInputValueChange( value )
    }

    return (
        <View>
            <Input
                label={ isRequired ? `${value.ControlLabel} *` : value.ControlLabel}
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Type Here"
                placeholderTextColor="#9EA0A4"
                inputContainerStyle={inputContainerStyle}
                inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={onChangeText}
            />
        </View>
    )
}

export const EditableDropdown = ( { value, isRequired, onInputValueChange } ) => {
    const controlValues = value.ControlValues.map( item => {
        const control = { label: item.Value, value: item.Id }
        return control
    })
    const onValueChange = ( value ) => {
        setDropdownValue( value )
        onInputValueChange( value )
    }
    const [dropdownValue,setDropdownValue] = useState( '' )
    return (
        <View>
            <CustomDropdown
                title={ isRequired ? `${value.ControlLabel} *` : value.ControlLabel}
                items={controlValues}
                value={dropdownValue}
                onValueChange={onValueChange}
            />
        </View>
    )
}

let date = new Date();
export const CustomCalendar = ( { value, isRequired } ) => {
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateValue, setDateValue] = useState('');

    const showMode = (currentMode) => {
        if( currentMode === 'date' ) {
            setShow(true);
        }else{
            setShowTime( true )
        }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const hideDatePicker = ( ) => {
        setShow( false )
    }

    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        const pickedDate = moment(currentDate).format("MM/DD/YYYY")
        setDateValue(pickedDate)
        date = currentDate
        hideDatePicker()
    };
    
    return (
        <View>
            <CustomDateTimePicker
                label={ isRequired ? `${value.ControlLabel} *` : value.ControlLabel}
                onPress={showDatepicker}
                show={show}
                inputValue={dateValue}
                mode={mode}
                display="spinner"
                value={date}
                maximumDate={new Date()}
                onConfirm={onChange}
                onCancel={hideDatePicker}
            />
        </View>
    )
}

export const CustomCheckBox = ( { value, isRequired } ) => {
    const [checkboxValue, setCheckboxValue] = useState( false )

    const toggleCheckBoxValue = ( ) => {
        setCheckboxValue( checkboxValue => !checkboxValue )
    }
    return (
        <View style={{ backgroundColor: 'transparent'}}>
            <CheckBox
                title={isRequired ? `${value.ControlLabel} *` : value.ControlLabel}
                checked={checkboxValue}
                onPress={toggleCheckBoxValue}
            />
        </View>
    )
}

export const CustomRadioButtonList = ( { value, isRequired } ) => {
    const radioButtonList = value.ControlValues.map( item => {
        const radio = {
            label: item.Value,
            value: item.Id
        }
        return radio
    })
    const [radioValue,setRadioValue] = useState( '' )

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{
                color: '#86939e',
                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '3%'
            }}>{isRequired ? `${value.ControlLabel} *` : value.ControlLabel}</Text>
            <RadioForm style={{ width: '100%', paddingHorizontal: 30 }}
                radio_props={radioButtonList}
                initial={-1}
                radioStyle={{ paddingBottom: 5 }}
                buttonSize={15}
                buttonColor={'#86939e'}
                selectedButtonColor={'#1e5873'}
                labelStyle={{ fontSize: 20 }}
                animation={true}
                onPress={(value) => setRadioValue(value)}
            />
        </View>
    )
}

export const CustomTextAreaInput = ( { value, isRequired } ) => {
    const [inputValue,setInputValue] = useState( value?.SelectedValue )
    return (
        <View>
            <Input
                label={!isEmpty(isRequired) && isRequired ? `${value.ControlLabel} *` : value.ControlLabel}
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Type Here"
                placeholderTextColor="#9EA0A4"
                inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={(text) => setInputValue( text )}
            />
        </View>
    )
}



let remainingDropdownArray = []
let selectedScoreArray = []
export const AuditDetailsScreen = () => {
    const route = useRoute()
    const { auditDetails, Type, selectedDropdownValue, dropdownObject, PrimaryUserID, AuditAndInspectionTemplateID } = route.params
    const [checkboxValue,setCheckboxValue] = useState( false )
    const [inputValue,setInputValue] = useState( '' )
    const [skipReasonValue,setSkipReasonValue] = useState( '' )
    const [dropdownvalue,setDropdownValue] = useState( '' )
    const [userInfo,setUserInfo] = useState( {} )
    const [isReset,setIsReset] = useState( false )
    const [shouldShowWarningMessage,setShouldShowWarningMessage] = useState( false )
    const [imagesObject,setImagesObject] = useState( {} )
    const [systemFieldsArray,setSystemFieldsArray] = useState( [] )
    const [groupsArray,setGroupsArray] = useState( [] )
    const [returnData,setReturnData] = useState( {} )
    const [cancelData,setCancelData] = useState( {} )
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const keyboard = useKeyboard()
    const navigation = useNavigation()

    useEffect( ( ) => {
        setDefaultSystemFieldsArray()
    }, [] )
    
    useEffect( ( ) => {
        setupGroupsArray()
    }, [] )
    
    
    useFocusEffect(
        React.useCallback( () => {
            setupLocalStorageValuesOnFocus()
        }, [])
      );

      const setupLocalStorageValuesOnFocus = async ( ) => {
        var tempData = await AsyncStorage.getItem("returndata")
            tempData = JSON.parse(tempData)
            await AsyncStorage.removeItem("returndata");
            var cancelData = await AsyncStorage.getItem("cancelData")
            cancelData = JSON.parse(cancelData)
            setCancelData( cancelData )
            setReturnData(tempData)
    }

    const setupGroupsArray = ( ) => {
        const data = auditDetails.GroupsAndAttributes.Groups.map( item => {
            const attributesArray = item.Attributes.map( val => {
                const attribute = {
                    CustomFormResultID: val.CustomFormResultID,
                    GivenAnswerID: val.GivenAnswerID,
                    SourceID: val.SourceID,
                    HazardsID: val.HazardsID,
                    Comments: val.Comments,
                    AttributeID: val.AttributeID,
                    AuditAndInspectionScore: val.AuditAndInspectionScore,
                    IsCommentsMandatory: val.IsCommentsMandatory,
                    CorrectAnswerID: val.CorrectAnswerID,
                    ScoreList: val.ScoreList,
                    isRequired: val.IsCommentsMandatory === "Mandatory" ? 'Comments *' : 'Comments',
                    isHazardsRequired: val.DoNotShowHazard === "True" || val.AuditAndInspectionScore === "Do Not Show Score" ? false : true
                }
                return attribute
            })

            const finalGroupData = {
                Attributes: attributesArray
            }
            return finalGroupData
        })
        setGroupsArray( data )
    }

    const setDefaultSystemFieldsArray = ( ) => {
        const data = auditDetails.SystemFields.SystemFields.map( item => {
            const systemFieldrow = {
                ControlID: item.ControlID,
                SelectedValue: item.SelectedValue,
                IsMandatory: item.IsMandatory
            }
            return systemFieldrow
        })
        setSystemFieldsArray( data )
    }

    useEffect( ( ) => {
        getUserdetails()
    }, [] )

    useEffect( ( ) => {
        checkIfWarningMessageNeedsToBeDisplayed()
    }, [] )

    const checkIfWarningMessageNeedsToBeDisplayed = ( ) => {
        if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" && auditDetails.AuditAndInspectionDetails?.ReportingPeriodDueDates === null ) {
            setShouldShowWarningMessage( true )
            return null
        }
    }

    
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

    const onDeleteAuditAndInspectionRecord = async ( ) => {
        try {
            const user = await fetchUserInfoFromStorage()
            const token = await AsyncStorage.getItem('Token')
        const payload = {
            UserID: user?.UserID,
            AccessToken: token,
            AuditAndInspectionID: auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID,
        }
        const result = await api.post({
            url: `api/AuditAndInspection/DeleteAuditAndInspection`,
            body: payload
        })
        if( isEmpty( result ) ) {
            return null
        }
        Toast.showWithGravity(result.Message, Toast.LONG, Toast.CENTER);
        navigation.goBack()
        }catch( error ) {
            Toast.showWithGravity(error.message || 'Something Went wrong while deleting audit records', Toast.LONG, Toast.CENTER);
        }
        
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
          "Are you sure you want to discard the changes?",
          [
            {
              text: "No",
              onPress: () => null
            },
            {
              text: "Yes",
              onPress: ( ) => onDeleteAuditAndInspectionRecord()
            }
          ],
        );
        return true
      }

    const onChangeDropdownValue = ( value ) => {
        let data = [...auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates]
        let reversedData = data.reverse()
        let currentSelectedIndex = lodash.findIndex(reversedData, function(o) { return o.ID === value });
        remainingDropdownArray = []
        for( let i=0;i<currentSelectedIndex;i++) {
            remainingDropdownArray.push( reversedData[i].Value )
        }        
        setDropdownValue( value )
    }

    const renderCustomDropdown = ( ) => {
        let data = auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates.map( item => {
            const currentReportingPeriod = { label: item.Value, value: item.ID }
            return currentReportingPeriod
        })
        return (
            <CustomDropdown
                title="Last Day of Schedule Period *"
                value={dropdownvalue}
                onValueChange={onChangeDropdownValue}
                items={data}
            />
        )
    }

    const renderAuditDetailsRow = ( title, value ) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '2%', marginHorizontal: '1%', backgroundColor: 'transparent' }}>
                    <View>
                        <Text style={{ paddingLeft: '5%', paddingRight: '2%', color: 'black', fontSize: 16 }}>{title}</Text>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: '1%' }}>
                        <Text numberOfLines={0} >{value}</Text>
                    </View>      
            </View>
        )
    }

    const onInputValueChange = ( value, list ) => {
        let arrayData = [...systemFieldsArray]
        arrayData = arrayData.map( item => {
            if( item.ControlID === list.ControlID ) {
                item.SelectedValue = value
                return item
            }
            return item
        } )
        setSystemFieldsArray( arrayData )
    }



    const renderItem = ( { item } ) => {
        switch( item.ControlType ) {
            case 'TextBox': {
                return (
                   <CustomInput value={item} onInputValueChange={(value)=>onInputValueChange(value,item)} isRequired={item.IsMandatory === "True" ? true : false }/>
                )
            }
            case 'DropDownList':                               
                return (
                   <EditableDropdown value={item} onInputValueChange={(value)=>onInputValueChange(value,item)} isRequired={item.IsMandatory === "True" ? true : false }/>
                )
            case 'Calendar':
                return (
                    <CustomCalendar value={item} isRequired={item.IsMandatory === "True" ? true : false }/>
                )
            case 'Checkbox':
                return (
                    <CustomCheckBox value={item} isRequired={item.IsMandatory === "True" ? true : false }/>
                )
            case 'CheckBoxList':
                return (
                    <CustomMultiSelectCheckbox value={item} />
                )
            case 'RadioButtonList':
                return (
                    <CustomRadioButtonList value={item} isRequired={item.IsMandatory === "True" ? true : false } />
                )
            case 'TextArea':
                return (
                    <CustomTextAreaInput value={item} isRequired={item.IsMandatory === "True" ? true : false }/>
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
    
    
    const checkIsCommentsMandatory = ( isMandatoryType , selectedScoreValue, CorrectAnswerID, ScoreList ) => {
        const shouldCheckForNonApplicableValues = ScoreList.find( item => {
            if( item.Value === "Not Applicable" && item.ID === selectedScoreValue ) {
                return true
            }else{
                return false
            }
        })
        const checkIfTruthyValues = ScoreList.find( item => {
            if( ["True", "False", "Yes", "No"].includes( item.Value ) && item.ID === selectedScoreValue ) {
                return true
            }else{
                return false
            }
        })
        let commentLabel = ''
        switch( isMandatoryType ) {
            case 'Mandatory': {
                commentLabel = 'Comments *'
                break;
            }
            case 'Mandatory for Passing Score': {
                if( shouldCheckForNonApplicableValues ) {
                    commentLabel = 'Comments'
                    break;
                }
                else if( checkIfTruthyValues ? Number( selectedScoreValue ) === Number( CorrectAnswerID ) : Number( selectedScoreValue ) >= Number( CorrectAnswerID ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
            case 'Mandatory for Failing Score': {
                if( Number(selectedScoreValue) !== 0 && Number( selectedScoreValue ) < Number( CorrectAnswerID ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                }
                
            }
            case 'Not Mandatory': {
                commentLabel = 'Comments'
                break;
            }
            case 'Mandatory for N/A': {
                if( shouldCheckForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
                
            }
            case 'Mandatory for Passing Score and N/A': {
                if( Number( selectedScoreValue ) >= Number( CorrectAnswerID ) || shouldCheckForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
            case 'Mandatory for Failing Score and N/A': {
                if( Number( selectedScoreValue ) < Number( CorrectAnswerID ) || shouldCheckForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
        }
        return commentLabel
    }
    
    const checkIsHazardsPresentAndRequired = ( selectedScoreValue, CorrectAnswerID, ScoreList ) => {
        const shouldCheckForNonApplicableValues = ScoreList.find( item => {
            if( item.Value === "Not Applicable" && item.ID === selectedScoreValue ) {
                return true
            }else{
                return false
            }
        })
        const checkIfTruthyValues = ScoreList.find( item => {
            if( ["True", "False", "Yes", "No"].includes( item.Value ) && item.ID === selectedScoreValue ) {
                return true
            }else{
                return false
            }
        })
        if( checkIfTruthyValues ? Number(selectedScoreValue) === Number(CorrectAnswerID) : Number( selectedScoreValue ) >= Number( CorrectAnswerID ) ) {
            return false
        }else{
            return true
        }
    }

    const currentSelectedScoreValue = ( value, id  ) => {
        if( value === null ) {
            Toast.showWithGravity('Please Select score from score column', Toast.LONG, Toast.CENTER);
            return null
        }
        let clonedGroupsArray = [...groupsArray]
        clonedGroupsArray = clonedGroupsArray.map( groups => {
            groups = groups.Attributes.map( attribute => {
                if( attribute.AttributeID === id ) {
                    attribute.isHazardsRequired = checkIsHazardsPresentAndRequired( value, attribute.CorrectAnswerID, attribute.ScoreList )
                    attribute.isRequired = checkIsCommentsMandatory( attribute.IsCommentsMandatory, value, attribute.CorrectAnswerID, attribute.ScoreList  )
                    attribute.GivenAnswerID = value
                    return attribute
                }
                return attribute
            })
            return {
                Attributes: groups
            }
        })
        setGroupsArray( clonedGroupsArray )
    }
    const onSelectedSourceValue = ( value, id  ) => {
        if( value === null ) {
            return null
        }
        let clonedGroupsArray = [...groupsArray]
        clonedGroupsArray = clonedGroupsArray.map( groups => {
            groups = groups.Attributes.map( attribute => {
                if( attribute.AttributeID === id ) {
                    attribute.SourceID = value
                    return attribute
                }
                return attribute
            })
            return {
                Attributes: groups
            }
        })
        setGroupsArray( clonedGroupsArray )
    }
    const onHazardValueSelected = ( value, id  ) => {
        if( value === null ) {
            return null
        }
        let clonedGroupsArray = [...groupsArray]
        clonedGroupsArray = clonedGroupsArray.map( groups => {
            groups = groups.Attributes.map( attribute => {
                if( attribute.AttributeID === id ) {
                    attribute.HazardsID = value
                    return attribute
                }
                return attribute
            })
            return {
                Attributes: groups
            }
        })
        setGroupsArray( clonedGroupsArray )
    }

    const onCommentInputChange = ( value, id  ) => {
        if( value === null ) {
            return null
        }
        let clonedGroupsArray = [...groupsArray]
        clonedGroupsArray = clonedGroupsArray.map( groups => {
            groups = groups.Attributes.map( attribute => {
                if( attribute.AttributeID === id ) {
                    attribute.Comments = value
                    return attribute
                }
                return attribute
            })
            return {
                Attributes: groups
            }
        })
        setGroupsArray( clonedGroupsArray )
    }


    const renderDynamicGroupsAndAttributes = ( checkboxValue ) => {
        var sortedGroupsData = _.sortBy( auditDetails.GroupsAndAttributes?.Groups, ( item ) => item.GroupOrder )
        sortedGroupsData = sortedGroupsData.map(item=>{
            item.Attributes.map(innerItem=>{
                innerItem.shouldClearHazard = false
                if(innerItem.CustomFormResultID  ==  returnData?.CustomFormResultID ){          
                    innerItem.Comments = returnData?.commentsValue
                }
                if( innerItem.CustomFormResultID == cancelData?.CustomFormResultID ) {
                    innerItem.HazardsID = cancelData?.HazardsID
                    innerItem.shouldClearHazard = true
                }
                return innerItem
            })
            return item
        })

        var shouldShowHazardDetails = auditDetails.AuditAndInspectionDetails?.IsDisplayHazardList
        var shouldShowSourceDetails = auditDetails.AuditAndInspectionDetails?.IsDisplaySource
        var scoreLabel = auditDetails.AuditAndInspectionDetails?.ScoringLable
        return sortedGroupsData.map( item => {
            return (
                <DynamicGroupsCard 
                    dynamicGroups={item}  
                    sourceList={shouldShowSourceDetails ? auditDetails.GroupsAndAttributes.SourceList : [] } 
                    hazardList={shouldShowHazardDetails ? auditDetails.GroupsAndAttributes.HazardList : [] }
                    scoreLabel={scoreLabel}
                    auditAndInspectionId={auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID}
                    checkboxValue={checkboxValue}
                    currentSelectedScoreValue={(value, id )=>currentSelectedScoreValue(value, id )}
                    onSelectedSourceValue={(value, id )=>onSelectedSourceValue(value, id )}
                    onHazardValueSelected={(value, id )=>onHazardValueSelected(value, id )}
                    onCommentInputChange={(value, id )=>onCommentInputChange(value, id )}
                />
            )
        })
    }

    const checkForValidPayload = ( ) => {
        if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" && auditDetails.AuditAndInspectionDetails?.ReportingPeriodDueDates === null ) {
            return true
        }else{
            const isValidSchedulePeriod = shouldShowWarningMessage ? dropdownvalue === ''  : !lodash.isEmpty(dropdownvalue)
            if( isValidSchedulePeriod && !shouldShowWarningMessage ) {
                return true
            }else{
                return false
            }
        }
    }

    const checkForSkippedReason = ( ) => {
                let result = false
                if( remainingDropdownArray.length === 0 ) {
                    result = true
                }
                else if( skipReasonValue !== '' ) {
                    result = true
                }else{
                    result = false
                }
                return result
    }

    const checkForRequiredDynamicFields = ( ) => {
        var isFlagOn = true

        const clonedSystemFieldsArray = [...systemFieldsArray]
        const fieldsArray = clonedSystemFieldsArray.map( item => {
            if( item.IsMandatory === "True" ) {
                if(isFlagOn){
                    if(isEmpty(item.SelectedValue)){
                        if(item.IsMandatory){
                            Toast.showWithGravity( `${item.ControlID} is required`, Toast.LONG, Toast.CENTER);
                            isFlagOn= false
                            return false
                        }

                    }
                }

                return !isEmpty( item.SelectedValue )
            }else{
                return true
            }
        })
        const result = fieldsArray.every( item => item === true )
        return result
    }

    const checkForScoresItem = ( ) => {
        let groupsArrayToCheck = []
        const clonedGroupsArray = [...groupsArray]
        clonedGroupsArray.map( item => {
            const clonedGroupsAttributeArray = [...item.Attributes]
            clonedGroupsAttributeArray.map( val => {
                if( val.AuditAndInspectionScore === "Do Not Show Score" ) {
                    groupsArrayToCheck.push( true )
                    return val
                }else{
                    const givenAnswer = val.GivenAnswerID === "0" || val.GivenAnswerID === null ? false : true
                    groupsArrayToCheck.push( givenAnswer )
                    return val  
                }
            })
            return item
        })
        const result = groupsArrayToCheck.every( item => item === true )
        return result
    }
    const checkForHazardsItem = ( ) => {
        let groupsArrayToCheck = []
        const clonedGroupsArray = [...groupsArray]
        clonedGroupsArray.map( item => {
            const clonedGroupsAttributeArray = [...item.Attributes]
            groupsArrayToCheck = clonedGroupsAttributeArray.map( val => {
                if( val.isHazardsRequired === true && !['','0',0,null,undefined].includes(val.HazardsID) ) {
                    return true
                }else if( val.isHazardsRequired === true && ['','0',0,null,undefined].includes(val.HazardsID) ) {
                    return false
                }else if( val.isHazardsRequired === false ) {
                    return true
                }
            })
            return item
        })
        const result = groupsArrayToCheck.every( item => item === true )
        return result
    }

    const checkForCommentsItem = ( ) => {
        let groupsArrayToCheck = []
        const clonedGroupsArray = [...groupsArray]        
        clonedGroupsArray.map( item => {
            const clonedGroupsAttributeArray = [...item.Attributes] 
            clonedGroupsAttributeArray.map( val => {
                if( val.isRequired === "Comments *" && val.Comments !== "" ) {
                    groupsArrayToCheck.push( true )
                }else if( val.isRequired === "Comments" ) {
                    groupsArrayToCheck.push( true )
                }else{
                    groupsArrayToCheck.push( false )
                }
            })
            return item
        })
        const result = groupsArrayToCheck.every( item => item === true )
        return result
    }

    const onSubmit = async ( ) =>  {
        try {

            const checkForValidFields = checkForRequiredDynamicFields()
            if( !checkForValidFields ) {
               // Toast.showWithGravity('Please Enter Worksite mandatory data', Toast.LONG, Toast.CENTER);
                return null 
            }

            const isValid = checkForValidPayload()
            if( !isValid ) {
                Toast.showWithGravity('Last day of schedule period is required.', Toast.LONG, Toast.CENTER);
                return null
            }
            const isreasonFilled = checkForSkippedReason()
            if(!isreasonFilled){
                Toast.showWithGravity('Reason for skipping the last day of schedule period is required.', Toast.LONG, Toast.CENTER);
                return null
            }
           
            const checkForScores = checkForScoresItem() 
            if( !checkForScores ) {
                Toast.showWithGravity('Please select a score from the Score column', Toast.LONG, Toast.CENTER);
                return null 
            }
            const checkForComments = checkForCommentsItem() 
            if( !checkForComments ) {
                Toast.showWithGravity('Comment(s) required.', Toast.LONG, Toast.CENTER);
                return null 
            }
            const checkForHazards = checkForHazardsItem() 
            if( !checkForHazards ) {
                Toast.showWithGravity('Hazard is required.', Toast.LONG, Toast.CENTER);
                return null 
            }
            const reportingPeriodDueDate = !isEmpty( auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates ) ? auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates.find( item => item.ID === dropdownvalue) : ''
            const token = await AsyncStorage.getItem('Token')
            const systemsArrayWithoutMandatoryFields = systemFieldsArray.map( item => {
                const arrayFields = omit( item, 'IsMandatory' )
                return arrayFields
            })
            const groupsArrayWithOnlyRequiredFields = groupsArray.map( item => {
                const attributes =  item.Attributes.map( val => {
                    const attributeFields = omit( val, 'AttributeID', 'AuditAndInspectionScore', 'IsCommentsMandatory', 'CorrectAnswerID', 'ScoreList', 'isRequired', 'isHazardsRequired' )
                    return attributeFields
                })
                return {
                    Attributes: attributes
                }
            }) 
            const payload = {
                UserID: userInfo.UserID,
                PrimaryUserID: PrimaryUserID,
                AccessToken: token,
                AuditAndInspectionID: auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID,
                AuditAndInspectionTemplateID: AuditAndInspectionTemplateID,
                Type: Type,
                TypeID: auditDetails.AuditAndInspectionDetails?.TypeID,
                Notes: auditDetails.AuditAndInspectionDetails?.Notes,
                ReportingPeriodDueDateSelected: isEmpty( reportingPeriodDueDate ) ? null : reportingPeriodDueDate?.Value,
                ReportingPeriodDueDateSelectedID: dropdownvalue,
                NextDueDate: auditDetails.AuditAndInspectionDetails?.NextDueDate,
                SkippedReason: auditDetails.AuditAndInspectionDetails?.SkippedReason,
                SystemFields: {
                    AuditAndInspection_SystemFieldID: auditDetails.SystemFields?.AuditAndInspection_SystemFieldID,
                    SystemFields: systemsArrayWithoutMandatoryFields
                },
                GroupsAndAttributes: {
                    Groups: groupsArrayWithOnlyRequiredFields
                }
            }
            const result = await api.post({
                url: `api/AuditAndInspection/CompleteAudit`,
                body: payload
            })
            if( isEmpty( result ) ) {
                return null
            }else if( !isEmpty( result ) && isEmpty( imagesObject ) ) {
                Toast.showWithGravity(result?.Message, Toast.LONG, Toast.CENTER);
                setTimeout( ( ) => {
                    navigation.navigate( 'Home' )
                }, 2000 )
            }else if( !isEmpty( result ) && !isEmpty( imagesObject ) ) {
                const response = await api.imageUpload({
                    image: imagesObject,
                    url: `api/AuditAndInspection/UploadAuditImage?UserID=${userInfo.UserID}&AuditAndInspectionID=${auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID}`
                })
                if( isEmpty( response ) ) {
                    return null
                }
                navigation.navigate( 'Home' )
            }
        } catch ( error ) {
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
        }
    }


    const onSaveAndComeBack = async ( ) =>  {
        try {
            const isValid = checkForValidPayload()
            if( !isValid ) {
                Toast.showWithGravity('Last day of schedule period is required.', Toast.LONG, Toast.CENTER);
                return null
            }
            const isreasonFilled = checkForSkippedReason()
            if(!isreasonFilled){
                Toast.showWithGravity('Reason for skipping the last day of schedule period is required.', Toast.LONG, Toast.CENTER);
                return null
            }
            const reportingPeriodDueDate = !isEmpty( auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates ) ? auditDetails.AuditAndInspectionDetails.ReportingPeriodDueDates.find( item => item.ID === dropdownvalue) : ''
            const token = await AsyncStorage.getItem('Token')
            const systemsArrayWithoutMandatoryFields = systemFieldsArray.map( item => {
                const arrayFields = omit( item, 'IsMandatory' )
                return arrayFields
            })
            const groupsArrayWithOnlyRequiredFields = groupsArray.map( item => {
                const attributes =  item.Attributes.map( val => {
                    const attributeFields = omit( val, 'AttributeID', 'AuditAndInspectionScore', 'IsCommentsMandatory', 'CorrectAnswerID', 'ScoreList', 'isRequired' )
                    return attributeFields
                })
                return {
                    Attributes: attributes
                }
            }) 
            const payload = {
                UserID: userInfo.UserID,
                PrimaryUserID: PrimaryUserID,
                AccessToken: token,
                AuditAndInspectionID: auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID,
                AuditAndInspectionTemplateID: AuditAndInspectionTemplateID,
                Type: Type,
                TypeID: auditDetails.AuditAndInspectionDetails?.TypeID,
                Notes: auditDetails.AuditAndInspectionDetails?.Notes,
                ReportingPeriodDueDateSelected: isEmpty( reportingPeriodDueDate ) ? null : reportingPeriodDueDate?.Value,
                ReportingPeriodDueDateSelectedID: dropdownvalue,
                NextDueDate: auditDetails.AuditAndInspectionDetails?.NextDueDate,
                SkippedReason: auditDetails.AuditAndInspectionDetails?.SkippedReason,
                SystemFields: {
                    AuditAndInspection_SystemFieldID: auditDetails.SystemFields?.AuditAndInspection_SystemFieldID,
                    SystemFields: systemsArrayWithoutMandatoryFields
                },
                GroupsAndAttributes: {
                    Groups: groupsArrayWithOnlyRequiredFields
                }
            }
            const result = await api.post({
                url: `api/AuditAndInspection/SaveAudit`,
                body: payload
            })
            if( isEmpty( result ) ) {
                return null
            }else if( !isEmpty( result ) && isEmpty( imagesObject ) ) {
                Toast.showWithGravity(result?.Message, Toast.LONG, Toast.CENTER);
                setTimeout( ( ) => {
                    navigation.navigate( 'Home' )
                }, 2000 )
            }else if( !isEmpty( result ) && !isEmpty( imagesObject ) ) {
                const response = await api.imageUpload({
                    image: imagesObject,
                    url: `api/AuditAndInspection/UploadAuditImage?UserID=${userInfo.UserID}&AuditAndInspectionID=${auditDetails.AuditAndInspectionDetails?.AuditAndInspectionID}`
                })
                if( isEmpty( response ) ) {
                    return null
                }
                navigation.navigate( 'Home' )
            }
        } catch ( error ) {
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
        }
    }

    const onImageReceive = ( url, imageData ) => {
        const imageObj = { ...imageData, uri: url }
        setImagesObject( imageObj )
    }

    const navigateToImagePicker = ( ) => {
        navigation.navigate( 'UploadImage', {
            callback: ( url, imageData ) => onImageReceive( url, imageData )
        } )
    }

    const renderLastDayOfScheduledPeriod = ( ) => {
        if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" && auditDetails.AuditAndInspectionDetails?.ReportingPeriodDueDates === null ) {
            return null
        }
        else if( auditDetails.AuditAndInspectionDetails?.IsSchedulerRequired === "True" ) {
            return renderCustomDropdown()
        }else{
            return null
        }
    }

    const renderImage = ( ) => {
        if( !isEmpty( imagesObject ) ) {
            return (
                <View style={{ width: 100, height: 100, marginHorizontal: '5%', flexDirection: 'row'}}>
                    <Image
                        source={{ uri: imagesObject.uri }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    />
                </View>
            )
        }else{
            return null
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 0.9 }}>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: '2%', marginHorizontal: '5%' }}>
                        <Text numberOfLines={0}  style={{ color: '#1e5873', fontSize: 18}}>{auditDetails.AuditAndInspectionDetails?.AdhocWarnigMessage}</Text>
                    </View>
                )
                : null
            }
            {
                renderAuditDetailsRow( 'Record Number:', `${auditDetails.AuditAndInspectionDetails?.AuditAndInspectionNumber}`  )
            }
            <View style={{ marginHorizontal: '1%'}}>
                <CheckBox
                    title="Select Passing Values for Incomplete Tasks:"
                    checked={checkboxValue}
                    onPress={toggleCheckBoxValue}
                    iconRight={true}
                    textStyle={{ fontSize: 16 ,color: 'black', fontWeight: '600'}}
                    containerStyle={{ padding: 0, backgroundColor: 'white', borderWidth: 0, marginHorizontal: '2%' }}
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
            <View flex={0.5} style={{ marginHorizontal: '0.5%' }}>
                {
                   renderLastDayOfScheduledPeriod()
                }
            </View>
            {
                remainingDropdownArray && remainingDropdownArray.length > 0
                ? (
                    <View>
                        <View>
                            <Text numberOfLines={0} style={{ color: '#9EA0A4', fontWeight: 'bold', marginHorizontal: '5%' }}>
                                {
                                    `By doing this, following period(s) will be skipped: ${remainingDropdownArray}`
                                }
                            </Text>
                        </View>
                        <View style={{ marginTop: '3%', marginHorizontal: '2.2%' }}>
                            <Input
                                label="Reason for Skipping the Last Day of Schedule Period *"
                                labelStyle={{ marginBottom: 5, fontWeight: 'bold' }}
                                textAlignVertical="top"
                                placeholder="Type Here"
                                placeholderTextColor="#9EA0A4"
                                inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                                inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                                value={skipReasonValue}
                                onChangeText={(text) => setSkipReasonValue( text )}
                            />
                        </View>
                    </View>
                )
                : null
            }
            {
                !_.isEmpty( auditDetails.AuditAndInspectionDetails.ScheduleFrequency ) 
                ? renderAuditDetailsRow( 'Schedule Frequency:', `${auditDetails.AuditAndInspectionDetails.ScheduleFrequency}` )
                : null
            }
            <View style={{ marginHorizontal: '2%'}}>
                {
                    renderDynamicFields()
                }
            </View>
            <View style={{ marginTop: -25 }}>
                {
                    renderDynamicGroupsAndAttributes( checkboxValue )
                }
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                {renderImage()}
            </View>
            </ScrollView>
        </View>
        <View style={{position: 'absolute', bottom: keyboard.keyboardShown ? '15%' : '10%' , right: 10, left: '85%'}}>
            <Avatar size="medium" rounded icon={{ name: 'camera', type:'feather'}} containerStyle={{ backgroundColor: '#1e5873'}} onPress={navigateToImagePicker}/>
        </View>
        <View style={{ flex: 0.1 }}>
            <View style={{ flex: 0.8, marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <Button  title="Submit" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} onPress={onSubmit} containerStyle={{ width: '42%'}} />
                <Button  title="Save & Come Back" titleStyle={{ fontSize: 14 , fontWeight:'bold'}} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} onPress={onSaveAndComeBack} containerStyle={{ width: '42%'}} />
            </View>
        </View>
        </View>
    )
}
