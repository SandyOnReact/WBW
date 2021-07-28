import React, { useCallback, useEffect, useState } from 'react'
import { View , Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Header, Input, Button, Icon } from "react-native-elements"
import RadioForm from 'react-native-simple-radio-button';
import { useNavigation, useRoute } from "@react-navigation/native"
import { isEmpty } from "lodash"
import { CustomDropdown } from '../components/core/custom-dropdown'
import { CustomDateTimePicker } from '../components/datetimepicker'
import { AutoCompleteInput } from '../components/autocomplete-input/autocomplete.input'
import { Async } from 'react-async';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import Toast from 'react-native-simple-toast'
import moment from "moment"


const radioButtons = [
    { label: 'Complete Task', value: "Complete Task" },
    { label: 'Assign Task', value: "Assign Task" }
]

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
export const CustomInput = ( { value, label } ) => {
    const [inputValue,setInputValue] = useState( value )  
    return (
        <View>
            <Input
                label={label}
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder={label}
                placeholderTextColor="#9EA0A4"
                inputContainerStyle={inputContainerStyle}
                inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={(text) => setInputValue( text )}
            />
        </View>
    )
}

export const CustomTextAreaInput = ( { value, label, onChangeText, multiline = false, numberOfLines = 1  } ) => {
    return (
        <View>
            <Input
                label={label}
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder={label}
                placeholderTextColor="#9EA0A4"
                inputStyle={{paddingHorizontal: 10, paddingVertical: 5, textAlign: 'auto',fontSize:16}}
                inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={value}
                multiline={multiline}
                numberOfLines={numberOfLines}
                onChangeText={onChangeText}
            />
        </View>
    )
}

export const CompleteTask = ( props ) => {
    const {
        selectedHazardValue,
        hazardData,
        item,
        auditAndInspectionId,
        onCancel
    } = props
    const [hazardImageValue,setHazardImageValue] = useState( '' )
    const [imagesObject, setImagesObject ] = useState( {} )
    const [commentsValue, setCommentsValue] = useState( '' )
    const [isButtonLoading, setIsButtonLoading] = useState( false )
    const [taskTitle, setTaskTitle] = useState( item.Title )
    const navigation = useNavigation()

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    const selectedHazard = hazardData.find( item => item.value === selectedHazardValue )

    const onImageReceive = ( url, imageData ) => {
        const imageObj = { ...imageData, uri: url }
        setImagesObject( imageObj )
    }

    const navigateToImagePicker = ( ) => {
        navigation.navigate( 'UploadImage', {
            callback: ( url, imageData ) => onImageReceive( url, imageData )
        } )
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

    const onCompleteTask = async ( ) => {
        setIsButtonLoading( true )
        const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const isValid = [
            item.TaskTitle,
            commentsValue
        ]
        const notValidPayload = isValid.includes( "" ) 
        if( notValidPayload ) {
            setIsButtonLoading( false )
            Toast.showWithGravity('Please fill all the details marked as required', Toast.LONG, Toast.CENTER);
            return null
        }else{
            try {
                const payload = {
                    UserID: user.UserID,
                    AccessToken: token,
                    AuditAndInspectionID: auditAndInspectionId,
                    TaskTitle: item.Title,
                    Comments: commentsValue,
                    AttributeID: item.AttributeID,
                    HazardsID: selectedHazardValue, 
                    CustomFormResultID: item.CustomFormResultID
                }
                const result = await api.post({
                    url: `api/AuditAndInspection/CompleteTask`,
                    body: payload
                })
                // case 1: if result is empty 
                if( isEmpty( result ) ) {
                    return null
                }
                // case 2: if result, but not images
                else if( !isEmpty( result ) && isEmpty( imagesObject ) ) {
                    Toast.showWithGravity( 'Task Completed Successfully', Toast.LONG, Toast.CENTER);
                    setTimeout(() => {
                        navigateToBackScreen()
                    }, 2000);
                }
                // case 3: if both present
                else{
                    const response = await api.imageUpload({
                        image: imagesObject,
                        url: `api/AuditAndInspection/UploadCompleteImage?UserID=${user.UserID}&AuditAndInspectionID=${auditAndInspectionId}&AuditAndInspectionTaskID=${result.AuditAndInspectionTaskID}`
                    })
                    if( isEmpty( response ) ) {
                        return null
                    }
                    setTimeout(() => {
                        navigateToBackScreen()
                    }, 2000);
                }
            } catch( error ) {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
                return null
            } finally {
                setIsButtonLoading( false )
            }
        }       
    }

    const navigateToBackScreen = ( ) => {
        navigation.goBack()
    }

    return (
       <View style={{ flex: 1, marginHorizontal: '3%', marginVertical: '3%' }}>
           <ScrollView showsVerticalScrollIndicator={false}>
           <View style={{ flexDirection: 'row', marginHorizontal: '3%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Selected Hazard: </Text>
                <Text style={{ marginHorizontal: '5%', fontSize: 16 }}>{selectedHazard?.label}</Text>
           </View>
           <View style={{ marginVertical: '5%'}}>
               <CustomTextAreaInput onChangeText={(text)=>setTaskTitle( text )} multiline={true} numberOfLines={0} value={taskTitle} label="Task Title" />
           </View>
           <View>
               <CustomTextAreaInput onChangeText={(text)=>setCommentsValue( text )} value={commentsValue} label="Comments" />
           </View>
            <View style={{ marginTop: '5%'}}>
                    <Input
                        label="Upload Hazard Completion Image"
                        labelStyle={{ marginBottom: 5 }}
                        textAlignVertical="top"
                        placeholder="Select Image"
                        placeholderTextColor="#9EA0A4"
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                        containerStyle={{ margin: 0 }}
                        rightIcon={{ name: 'camera', type:'feather', style: { marginRight: 10 }, onPress: navigateToImagePicker }}
                        errorStyle={{ margin: -5 }}
                        value={hazardImageValue}
                        onChangeText={(text) => setHazardImageValue( text )}
                        />
                </View>
                <View>
                    {renderImage()}
                </View>
                <View style={{ marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Button  title="Complete Task" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}} loading={isButtonLoading}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={onCompleteTask} />
                    <Button  title="Cancel" titleStyle={{ fontSize: 14 , fontWeight:'bold'}} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={()=>navigation.goBack()}/>
                </View>
                </ScrollView>
       </View>
    )
}

let date = new Date();
export const CustomCalendar = ( { value, onDateChange } ) => {
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateValue, setDateValue] = useState( value );

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
        onDateChange( datevalue )
        date = currentDate
        hideDatePicker()
    };
    
    return (
        <View style={{ flex: 1 }}>
            <CustomDateTimePicker
                label="* Due Date"
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

export const EditableDropdown = ( { value, label } ) => {
    const controlValues = value.ControlValues.map( item => {
        const control = { label: item.Value, value: item.Id }
        return control
    })
    const onValueChange = ( value ) => {
        setDropdownValue( value )
    }
    const [dropdownValue,setDropdownValue] = useState( '' )
    return (
        <View>
            <CustomDropdown
                title={label}
                items={controlValues}
                value={dropdownValue}
                onValueChange={onValueChange}
            />
        </View>
    )
}

export const ShowTaskDetails = ( props ) => {
    const {
        taskDetails,
        selectedHazardValue,
        hazardData,
        onDelete
    } = props
    const [isButtonLoading,setIsButtonLoading] = useState( false )
    const [isDeleteButtonLoading,setIsDeleteButtonLoading] = useState( false )
    const navigation = useNavigation()

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }
    const newHazard = hazardData.find( item => item.value === selectedHazardValue )

    const onUpdateHazard = async ( ) => {
        try {
            setIsButtonLoading( true )
            const user = await fetchUserInfoFromStorage()
            const token = await AsyncStorage.getItem('Token')
            const payload = {
                UserID: user.UserID,
                AccessToken: token,
                HazardsID: selectedHazardValue,
                CustomFormResultID: item.CustomFormResultID
            }
            const result = await api.post({
                url: `api/AuditAndInspection/UpdateHazard`,
                body: payload
            })
            setIsButtonLoading( false )
            if( result && result?.Message === "Hazard Updated" ) {
                navigation.goBack()
                return null
            }      
        } catch( error ) {
            setIsButtonLoading( false )
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
            return null
        }
    }
    const onDeleteTask = async ( ) => {
        try {
            setIsDeleteButtonLoading( true )
            const user = await fetchUserInfoFromStorage()
            const token = await AsyncStorage.getItem('Token')
            const payload = {
                UserID: user.UserID,
                AccessToken: token,
                AuditAndInspectionTaskID: taskDetails.AuditAndInspectionTaskDetails?.AuditAndInspectionTaskID,
                CustomFormResultID: item.CustomFormResultID
            }
            const result = await api.post({
                url: `api/AuditAndInspection/DeleteTask`,
                body: payload
            })
            setIsDeleteButtonLoading( false )
            if( result && result?.Message === "Task Deleted" ) {
                Toast.showWithGravity("Task Deleted", Toast.LONG, Toast.CENTER);
                onDelete()
                return null
            }      
        } catch( error ) {
            setIsDeleteButtonLoading( false )
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
            return null
        }
    }

    return (
        <View style={{ flex: 1 }}>
           <View style={{ margin: '3%'}}>
                <Text style={{ fontSize: 18, color: 'black' }}>Instructions</Text>
                <Text style={{ fontSize: 16, fontWeight: '500'}}>{taskDetails?.Instructions}</Text>
           </View>
           <View style={{ flexDirection: 'row', margin: '3%'}}>
               <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Previous Hazards: </Text>
               <Text>{taskDetails?.PreviousHazard}</Text>
           </View>
           <View style={{ flexDirection: 'row', margin: '3%', alignItems: 'center' }}>
               <Text style={{ fontSize: 16, fontWeight: 'bold'}}>New Hazards: </Text>
               <Text style={{ fontSize: 14, marginLeft: '5%'}}>{newHazard?.label}</Text>
           </View>
           <View style={{ flex: 0.3 }}>
                <View style={{ flex: 0.8, marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Button  title="Update Hazard" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={onUpdateHazard} loading={isButtonLoading}/>
                    <Button  title="Delete Task" titleStyle={{ fontSize: 14 , fontWeight:'bold'}} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={onDeleteTask} loading={isDeleteButtonLoading}/>
                </View>
           </View>
        </View>
    )
}


export const AssignTask = ( props ) => {
    const {
        selectedHazardValue,
        hazardData,
        item,
        auditAndInspectionId
    } = props
    const [severityRatingList,setSeverityRatingList] = useState( [] )
    const [severityRating,setSeverityRating] = useState( '' )
    const [probabilityRatingList,setProbabilityRatingList] = useState( [] )
    const [probabilityRating,setProbabilityRating] = useState( '' )
    const [userList, setUserList] = useState( [] )
    const [shouldShowRiskRating, setShouldShowRiskRating] = useState( false ) 
    const [riskRatingValue, setRiskRatingValue]= useState( '' )
    const [dueDateValue, setDueDateValue] = useState( '' )
    const [descriptionValue,setDescriptionValue] = useState( '' )
    const [isButtonLoading, setIsButtonLoading] = useState( false )
    const [hazardImageValue,setHazardImageValue] = useState( '' )
    const [autoCompleteValue,setAutoCompleteValue] = useState( '' )
    const [shouldHideResults,setShouldHideResults] = useState( true )
    const [imagesObject, setImagesObject ] = useState( {} )
    const [selectedValue, setSelectedValue ] = useState( '' )
    const [filteredData, setFilteredData ] = useState( [] )
    const [taskTitle,setTaskTitle] = useState( item.Title )
    const navigation = useNavigation()
    const [isFetching,setIsFetching] = useState( false )
    const selectedHazard = hazardData.find( item => item.value === selectedHazardValue )

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    const fetchTaskRatingDetails = useCallback( async ( ) => {
        const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const result = await api.post({
            url: `api/Common/GetTaskRatingFilters`,
            body: {
                UserID: user.UserID,
                AccessToken: token,
                LevelID: user.LevelID
            }
        })
        if( isEmpty( result ) ) {
            return null
        }
        if( isEmpty( result.SeverityRating) || isEmpty(result.ProbabilityRating ) || isEmpty( result.UserList )) {
            return null
        }
        const severityRating = result.SeverityRating.map( item => {
            const severe = { label: item.SeverityRate, value: item.SeverityRateValue  }
            return severe
        })
        const probabilityRating = result.ProbabilityRating.map( item => {
            const probability = { label: item.ProbabilityRate, value: item.ProbabilityRateValue }
            return probability
        })

        const userList = result.UserList.map( item => {
            const user = { label: item.FullName, value: item.UserID }
            return user
        })
        setUserList( userList )
        setProbabilityRatingList( probabilityRating )
        setSeverityRatingList( severityRating )
    }, [] )

    const onImageReceive = ( url, imageData ) => {
        const imageObj = { ...imageData, uri: url }
        setImagesObject( imageObj )
    }

    const navigateToImagePicker = ( ) => {
        navigation.navigate( 'UploadImage', {
            callback: ( url, imageData ) => onImageReceive( url, imageData )
        } )
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

    const onAssignTask = async ( ) => {
        setIsButtonLoading( true )
        const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const isValid = [
            item.TaskTitle,
            severityRating,
            probabilityRating,
            descriptionValue,
            riskRatingValue,
            dueDateValue,
            selectedValue
        ]
        const notValidPayload = isValid.includes( "" )
        if( notValidPayload ) {
            setIsButtonLoading( false )
            Toast.showWithGravity('Please fill all the details marked as required', Toast.LONG, Toast.CENTER);
            return null
        }else{
            try {
                const payload = {
                    UserID: user.UserID,
                    AccessToken: token,
                    AuditAndInspectionID: auditAndInspectionId,
                    TaskTitle: item.Title,
                    Description: descriptionValue,
                    AttributeID: item.AttributeID,
                    AssignedToUserID: selectedValue,
                    DueDate: dueDateValue,
                    SeverityRating: severityRating,
                    ProbabilityRating: probabilityRating,
                    RiskRating: riskRatingValue,
                    HazardsID: selectedHazardValue, 
                    CustomFormResultID: item.CustomFormResultID
                }
                const result = await api.post({
                    url: 'api/AuditAndInspection/AssignTask',
                    body: payload
                })
                // case 1: if not result
                if( isEmpty( result ) ) {
                    return null
                } 
                // case 2: if result but not images
                else if( !isEmpty( result ) && isEmpty( imagesObject ) ) {
                    Toast.showWithGravity( 'Task Assigned Successfully', Toast.LONG, Toast.CENTER);
                    setTimeout(() => {
                        navigateToBackScreen()
                    }, 2000);
                }
                // case 3: if result and images
                else {
                    const response = await api.imageUpload({
                        image: imagesObject,
                        url: `api/AuditAndInspection/UploadAssignedImage?UserID=${user.UserID}&AuditAndInspectionID=${auditAndInspectionId}&AuditAndInspectionTaskID=${result.AuditAndInspectionTaskID}`
                    })
                    if( isEmpty( response ) ) {
                        return null
                    }
                    setTimeout(() => {
                        navigateToBackScreen()
                    }, 2000);
                }

            } catch( error ) {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
                return null
            } finally {
                setIsButtonLoading( false )    
            }
        }
    }

    const navigateToBackScreen = ( ) => {
        navigation.goBack()
    }

    const showRiskRating = ( ) => {
        setShouldShowRiskRating( true )
    }

    const fetchRiskRatingAndDueDate = async ( ) => {
        setIsFetching( true )
        setShouldShowRiskRating( false )
        try {
            const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const body = {
            UserID: user.UserID,
            AccessToken: token,
            AuditAndInspectionID: auditAndInspectionId,
            SeverityRateValue: severityRating,
            ProbabilityRateValue: probabilityRating
        }
        const result = await api.post({
            url: `api/AuditAndInspection/GetRiskRatingAndDueDate`,
            body: body
        })
        if( isEmpty( result ) ) {
            return null
        }
        setRiskRatingValue( result.RiskRating )
        setDueDateValue( result.DueDate )
        showRiskRating()
        } catch( error ) {
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
            return null
        } finally {
            setIsFetching( false )    
        }
    }

    const checkShowRiskRating = ( ) => {
        if( !isEmpty( severityRating ) && !isEmpty( probabilityRating ) && shouldShowRiskRating === false ) {
            fetchRiskRatingAndDueDate( )
        }
    }

    const onSeverityRatingChange = ( value ) => {
        setSeverityRating( value )
        setProbabilityRating( '' )
        setRiskRatingValue( '' )
        setShouldShowRiskRating( false )
        checkShowRiskRating()
    }

    const onProbabilityRatingChange = ( value ) => {
        setProbabilityRating( value )
        setShouldShowRiskRating( false )
        checkShowRiskRating()
    }

    const showDatepicker = () => {
        showMode('date');
    };

    const renderItem = ({ item }) => {
        return (
            <View>
                <Text onPress={() => {
                    setSelectedValue(item.value);
                    setFilteredData([]);
                    setAutoCompleteValue(item.label)
                }} style={styles.itemText}>
                    {item.label}
                </Text>
            </View>
        )
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            const newData = userList.filter(function (item) {
                const itemData = item.label
                    ? item.label.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
            setAutoCompleteValue(text);
        } else {
            setFilteredData([]);
            setSelectedValue('')
            setAutoCompleteValue(text);
        }
    };

    const renderTextInput = () => {
        return (
            <Input
                label="Select User"
                labelStyle={{ marginBottom: 5 }}
                placeholder="Select user"
                placeholderTextColor="#9EA0A4"
                style={{ fontSize: 16 }}
                value={autoCompleteValue}
                onFocus={()=>setShouldHideResults( false )}
                onEndEditing={()=>setShouldHideResults( true )}
                inputStyle={{padding:10, textAlign: 'auto', color: 'black', fontSize: 12}}
                inputContainerStyle={inputContainerStyle}
                rightIcon={<Icon name="caret-down" color="#1e5873" size={24} type="ionicon" /> }
                onChangeText={(text) => searchFilterFunction(text)}
            />
        )
    }

    if( isFetching ) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='red' />
            </View>
        )
    }

    return (
       <View style={{ flex: 1, marginHorizontal: '3%', marginVertical: '3%' }}>
           <Async promiseFn={fetchTaskRatingDetails}>
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
                   <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}  keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={{ flexDirection: 'row', marginHorizontal: '3%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Selected Hazard: </Text>
                                <Text style={{ marginHorizontal: '5%', fontSize: 16 }}>{selectedHazard?.label}</Text>
                        </View>
                        <View style={{ marginVertical: '5%'}}>
                            <CustomTextAreaInput 
                                value={taskTitle} 
                                onChangeText={(text)=> setTaskTitle( text )} 
                                label="Task Title"
                                multiline={true}
                                numberOfLines={0}
                            />
                        </View>
                        <View>
                            <CustomTextAreaInput 
                                value={descriptionValue} 
                                onChangeText={(text)=> setDescriptionValue( text )} 
                                label="* Description" 
                            />
                        </View>
                        <View style={{ flex: 9, marginVertical: '3%' }}>
                                <CustomDropdown
                                    title="* Severity Rating"
                                    items={severityRatingList}
                                    value={severityRating}
                                    onValueChange={onSeverityRatingChange}
                                />
                                <CustomDropdown
                                    title="* Probability Rating"
                                    items={probabilityRatingList}
                                    value={probabilityRating}
                                    onValueChange={onProbabilityRatingChange}
                                />
                        </View>
                        {
                            shouldShowRiskRating
                            ? (
                                <View>
                                    <View>
                                        <CustomInput value={riskRatingValue} label="* Risk Rating"/>
                                    </View>
                                    <View>
                                        <CustomCalendar value={dueDateValue} onDateChange={ ( value ) => setDueDateValue( value ) } />
                                    </View>
                                </View>
                            )
                            : null
                        }
                        <View style={{ flex: 1, marginTop: '3%'}}>
                            <AutoCompleteInput
                                style={{ color: 'black', borderColor: 'red', fontSize:'16'}}
                                data={autoCompleteValue.length === 0 && !shouldHideResults ? userList : filteredData}
                                renderItem={renderItem}
                                value={autoCompleteValue}
                                hideResults={shouldHideResults}
                                containerStyle={{flex:1, zIndex: 1}}
                                renderTextInput={renderTextInput}
                                keyExtractor={(i) => String( i ) }
                                maxListHeight={400}
                                fontSize={14}
                                flatListProps={{ nestedScrollEnabled: true }}
                            />
                        </View>
                        <View>
                            <Input
                                label="Upload Hazard Image"
                                labelStyle={{ marginBottom: 5 }}
                                textAlignVertical="top"
                                placeholder="Select Image"
                                placeholderTextColor="#9EA0A4"
                                inputContainerStyle={inputContainerStyle}
                                inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                                containerStyle={{ margin: 0 }}
                                rightIcon={{ name: 'camera', type:'feather', style: { marginRight: 10 }, onPress: navigateToImagePicker }}
                                errorStyle={{ margin: -5 }}
                                value={hazardImageValue}
                                onChangeText={(text) => setHazardImageValue( text )}
                                />
                        </View>
                        <View>
                            {renderImage()}
                        </View>
                        <View style={{ marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                            <Button  title="Assign Task" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}} loading={isButtonLoading}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={onAssignTask} />
                            <Button  title="Cancel" titleStyle={{ fontSize: 14 , fontWeight:'bold'}} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={navigateToBackScreen}/>
                        </View>
                    </ScrollView>
                    </View>
               </Async.Resolved>
           </Async>
       </View>
    )
}

const styles = StyleSheet.create({
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
    },
    descriptionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
        color: 'black'
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
    }
})

export const CompleteOrAssignTask = ( props ) => {
    const route = useRoute()
    const { 
        selectedHazardValue,
        hazardData,
        item,
        auditAndInspectionId,
        clear
    } = route.params
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const [radioValue,setRadioValue] = useState( 'Complete Task' )
    const [shouldShowTaskDetails,setShouldShowTaskDetails] = useState( false )
    const [isDataLoading,setIsDataLoading] = useState( false )
    const [taskDetails,setTaskDetails] = useState( {} )

    useEffect( ( ) => {
        getTasks()
    }, [] )


    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    const getTasks = async ( ) => {
        try {
            setIsDataLoading( true )
            const user = await fetchUserInfoFromStorage()
            const token = await AsyncStorage.getItem('Token')
            const payload = {
                UserID: user.UserID,
                AccessToken: token,
                AuditAndInspectionID: auditAndInspectionId,
                AttributeID: item.AttributeID,
                CustomFormResultID: item.CustomFormResultID
            }
            console.log( 'payload for getting tasks', JSON.stringify( payload ) )
            const result = await api.post({
                url: `api/AuditAndInspection/GetTask`,
                body: payload
            })
            console.log( 'result after getting task ',JSON.stringify(result) )
            setIsDataLoading( false )
            if( result && result.Message !== "No Task Found" ) {
                setShouldShowTaskDetails( true )
                setTaskDetails( result )
            } 
        } catch( error ) {
            setIsDataLoading( false )
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
            return null
        }
    }

    const navigatetoBackScreen = () => {
        clear()
        navigation.goBack()
    }

    const renderFormBasedOnRadioValue = ( ) => {
        if( radioValue === "Complete Task" ) {
            return (
                <CompleteTask 
                    selectedHazardValue={selectedHazardValue}
                    hazardData={hazardData}
                    item={item}
                    auditAndInspectionId={auditAndInspectionId}
                    onCancel={navigatetoBackScreen}
                />
            )
        }else{
            return (
                <AssignTask 
                    selectedHazardValue={selectedHazardValue}
                    hazardData={hazardData}
                    item={item}
                    auditAndInspectionId={auditAndInspectionId}
                />
            )
        }
    }

    const onDelete = ( ) => {
        setShouldShowTaskDetails( false )
    }

    if( isDataLoading ) { 
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="red" size="large"/>
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
                centerComponent={{ text: 'Complete or Assign Task', style: { color: '#fff', fontSize: 16 } }}
            />
            {
                shouldShowTaskDetails 
                ? <ShowTaskDetails 
                    taskDetails={taskDetails}
                    selectedHazardValue={selectedHazardValue}
                    hazardData={hazardData}
                    onDelete={onDelete}
                 />
                : (
                    <View style={{ flex: 1 }}>
                        <View style={{ marginVertical: 15 }}>
                            <Text style={{
                                color: '#86939e',
                                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                            }}>Please Select</Text>
                            <RadioForm style={{ marginLeft: 100 }}
                                radio_props={radioButtons}
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={true}
                                radioStyle={{ paddingRight: 50 }}
                                buttonColor={'#86939e'}
                                selectedButtonColor={'#1e5873'}
                                labelStyle={{ fontSize: 16 }}
                                animation={true}
                                style={{ paddingHorizontal: 15 }}
                                onPress={(value) => setRadioValue(value)}
                            />
                        </View>
                        {renderFormBasedOnRadioValue()}
                    </View>
                )
            }        
        </View>
    )
}

