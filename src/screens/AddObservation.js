import React, { useState, useEffect, memo } from 'react'
import { View, ScrollView, Text, ActivityIndicator, Image, Switch } from 'react-native'
import { Input, Header, Avatar,Button, Icon } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native"
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useFormik } from "formik"
import { string, object } from 'yup'
import RNPickerSelect from 'react-native-picker-select';
import { CustomDropdown } from '../components/core/custom-dropdown'
import { CustomDateTimePicker } from '../components/datetimepicker'
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import { isEmpty, isNull } from 'lodash'
import { AutoCompleteInput } from '../components/autocomplete-input/autocomplete.input'
import { CustomTimePicker } from '../components/core/custom-time-picker'
import { Alert } from 'react-native'
import Toast from 'react-native-simple-toast';
import { useKeyboard } from '@react-native-community/hooks'
import { StackActions } from '@react-navigation/native';
import { Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker';


let date = new Date();
let topicList = []
const radioButtons = [
    { label: 'Yes', value: "1" },
    { label: 'No', value: "0" }
]

export const MyCustomRightComponent = memo( ( props ) => {
    const { isEnabled, toggleSwitch } = props
    return (
        <View style={{ alignItems: 'center', flexDirection: 'row'}}>
            <Icon name= 'incognito' type='material-community' color='white'/>
            <Switch
                 trackColor={{ false: "gray", true: "white" }}
                 thumbColor={isEnabled ? "#68c151" : "white"}
                 ios_backgroundColor='lightgray'
                 onValueChange={toggleSwitch}
                 value={isEnabled}
                 style={{ marginHorizontal: '5%'}}
            />
        </View>
    )
}, ( prevProps, nextProps) => {
    prevProps.isEnabled === nextProps.isEnabled
})
export const HeaderComponent = ( props ) => {
    const { isEnabled, toggleSwitch } = props
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const navigatetoBackScreen = () => {
        navigation.goBack()
    }
    return (
        <View>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Add Observation', style: { color: '#fff', fontSize: 16 } }}
                rightComponent={<MyCustomRightComponent  isEnabled={isEnabled} toggleSwitch={toggleSwitch}/>}
            />
        </View>
    )

}
export const AddObservationScreen = ( props ) => {

    const { dashboard } = props.route.params
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [radioValue, setRadioValue] = useState('');
    const [observationOccur, setObservationOccur] = useState('');
    const [actValue, setActValue] = useState('');
    const [hazardValue, setHazardValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [actList, setActList] = useState([]);
    const [hazardList, setHazardList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [sectionValue, setSectionValue] = useState('');
    const [topicValue, setTopicValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [finalValue, setFinalView] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [autoCompleteList, setAutoCompleteList] = useState([]);
    const [autoCompleteValue, setAutoCompleteValue] = useState('');
    const [whereObservationHappened,setWhereObservationHappened] = useState( '' )
    const [observation,setObservation] = useState( '' )
    const [token,setToken] = useState( '' )
    const [userData,setUserData] = useState( {} )
    const [actText,setActText] = useState( '' )
    const [shouldHideResults,setShouldHideResults] = useState( true )
    const [isButtonLoading, setIsButtonLoading] = useState( false )
    const [isButtonAnonymously, setIsButtonAnonymously] = useState( false )
    const [isButtonComeBack, setIsButtonComeBack] = useState( false )
    const [isEnabled, setIsEnabled] = useState( false )
    const [imagesArray, setImagesArray] = useState( [] )
    
    const keyboard = useKeyboard()

    const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
    const navigation = useNavigation()
 
    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    useEffect(() => {
        getAllData()
    }, [])

    const getUser = async ( ) => {
        const user = await fetchUserInfoFromStorage()
        return user;
    }

    const getToken = async ( ) => {
        const token = await AsyncStorage.getItem('Token')
        return token
    }

    const getAllData = async () => {
        const user = await getUser()
        const token = await getToken()
        const payload = {
            UserID: user.UserID,
            AccessToken: token,
            CompanyID: user.CompanyID,
            ObservationSettingID: dashboard.ObservationSettingID
        }
        const result = await api.post({
            url: `api/Common/GetAllFilters`,
            body: {
                UserID: user.UserID,
                AccessToken: token,
                CompanyID: user.CompanyID,
                ObservationSettingID: dashboard.ObservationSettingID
            }
        })
        if (result === "Invalid User Token") {
            Toast.showWithGravity('Invalid User Token', Toast.LONG, Toast.CENTER);
            return null;
        }
        if (!result.ActOrConditions) {
            return null
        }

        if(!result.Locations) {
            return null
        }

        if (!result.Sections) {
            return null
        }

        if (!result.ObservationTime) {
            return null
        }
        setData(result)
        const actData = result.ActOrConditions.map(item => {
            const act = { label: item.Value, value: item.ID }
            return act;
        }, [])
        const hazardData = result.Hazards.map(item => {
            const hazard = { label: item.Value, value: item.ID }
            return hazard;
        }, [])

        const sectionData = result.Sections.map((item, index) => {
            const section = { label: item.Value, value: item.ID }
            return section;
        })
        const autoCompleteData = result.Locations.map((item) => {
            const autoComplete = { label: item.Value, value: item.ID }
            return autoComplete;
        })
        setSectionList(sectionData)
        // setTopicList( topicData )
        setActList(actData)
        setHazardList(hazardData)
        setIsLoading(false)
        setAutoCompleteList( autoCompleteData )
        return result;
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="red"/>
            </View>
        )
    }

    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        const pickedDate = moment(currentDate).format("MM/DD/YYYY")
        setDateValue(pickedDate)
        date = currentDate
        hideDatePicker()
    };
    
    const onChangeTime = (selectedTime) => {
        const currentDate = selectedTime || date;
        const pickedTime = moment(currentDate).format("hh:mm a")
        setTimeValue(pickedTime)
        date = currentDate
        hideTimePicker()
    };

    const hideDatePicker = ( ) => {
        setShow( false )
    }

    const hideTimePicker = ( ) => {
        setShowTime( false )
    }

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

    const showTimepicker = () => {
        showMode('time');
    };

    const onSectionValueChange = (value) => {
        if (isEmpty(value) || value === null) {
            topicList = []
            setSectionValue('')
            return null
        }
        const topicsBasedOnSections = data.Sections.find(item => {
            if (item.ID === value) return item
        })
        topicList = topicsBasedOnSections.Topics.map(item => {
            const topic = { label: item.Value, value: item.ID }
            return topic
        })
        setSectionValue(value)
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            const newData = autoCompleteList.filter(function (item) {
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
                label="*  Where did the Observation occur"
                labelStyle={{ marginBottom: 5 }}
                placeholder="Click Here"
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

    const saveAndComeBack = async ( ) => {
        setIsButtonComeBack( true )
        const user = await getUser()
        const token = await getToken()
        if( selectedValue === "" || selectedValue === undefined ) {
            setIsButtonComeBack( false )
            Toast.showWithGravity('Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER);
            return null
        }else{
            try {
                const payload = {
                    UserID: user.UserID,
                    AccessToken: token,
                    LevelID: selectedValue,
                    ObservationSettingID: dashboard.ObservationSettingID,
                    SectionID: sectionValue,
                    TopicID: topicValue,
                    ActOrConditionID: actValue,
                    ActOrCondition: actText,
                    HazardID: hazardValue,
                    Observation: observation,
                    IsFollowUpNeeded: radioValue,
                    ObservationDate: dateValue,
                    ObservationTime: timeValue,	
                    DescribeWhereTheIncidentHappened: whereObservationHappened
                }
                const result = await api.post({
                    url: 'api/Observation/SaveAndComeBackObservation',
                    body: payload
                })
                if( !isEmpty( result ) && imagesArray.length > 0 ) {
                    const response = await api.imageUpload({
                            image: imagesArray[0],
                            url: `api/Observation/Upload?ObservationID=${result}`
                    })
                    if( isEmpty( response ) ) {
                        return null
                    }
                    navigation.navigate( 'Home' )
                }else if( !isEmpty( result ) && imagesArray.length === 0 ) {
                    navigation.navigate( 'Home' )
                }else{
                    return null
                }
            }catch( error ) {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
                return null
            }finally {
                setIsButtonComeBack( false )    
            }
        }
    }

    const submitForm = async ( ) => {
        setIsButtonLoading( true )
        const user = await getUser()
        const token = await getToken()
        const validArray = [whereObservationHappened, dateValue,
            timeValue, actValue, actText, observation]
        const notValid = validArray.includes( "" )
        if( notValid ){
            setIsButtonLoading( false )
            Toast.showWithGravity('Please fill all the details marked as required', Toast.LONG, Toast.CENTER);
            return null
        }else if( selectedValue === "" || selectedValue === undefined ) {
            setIsButtonLoading( false )
            Toast.showWithGravity('Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER);
            return null
        }else{
            try {
                const payload = {
                    UserID: user.UserID,
                    AccessToken: token,
                    LevelID: selectedValue,
                    ObservationSettingID: dashboard.ObservationSettingID,
                    SectionID: sectionValue,
                    TopicID: topicValue,
                    ActOrConditionID: actValue,
                    ActOrCondition: actText,
                    HazardID: hazardValue,
                    Observation: observation,
                    IsFollowUpNeeded: radioValue,
                    ObservationDate: dateValue,
                    ObservationTime: timeValue,	
                    DescribeWhereTheIncidentHappened: whereObservationHappened
                }
                const result = await api.post({
                    url: 'api/Observation/SaveObservation',
                    body: payload
                })
                if( !isEmpty( result ) && imagesArray.length > 0 ) {
                    const response = await api.imageUpload({
                            image: imagesArray[0],
                            url: `api/Observation/Upload?ObservationID=${result}`
                    })
                    if( isEmpty( response ) ) {
                        return null
                    }
                    navigation.navigate( 'Home' )
                }else if( !isEmpty( result ) && imagesArray.length === 0 ) {
                    navigation.navigate( 'Home' )
                }else{
                    return null
                }
            }catch( error ) {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
                return null
            }finally {
                setIsButtonLoading( false )    
            }
        }
    }

    const submitFormAnonymously = async ( ) => {
        setIsButtonAnonymously( true )
        const user = await getUser()
        const token = await getToken()
        const validArray = [whereObservationHappened, dateValue,
            timeValue, actValue, actText, observation]
        const notValid = validArray.includes( "" )
        if( notValid ){
            setIsButtonAnonymously( false )
            Toast.showWithGravity('Please fill all the details marked as required', Toast.LONG, Toast.CENTER);
            return null
        }else if( selectedValue === "" || selectedValue === undefined ) {
            setIsButtonAnonymously( false )
            Toast.showWithGravity('Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER);
            return null
        }else{
            try {
                const payload = {
                    UserID: user.UserID,
                    AccessToken: token,
                    LevelID: selectedValue,
                    ObservationSettingID: dashboard.ObservationSettingID,
                    SectionID: sectionValue,
                    TopicID: topicValue,
                    ActOrConditionID: actValue,
                    ActOrCondition: actText,
                    HazardID: hazardValue,
                    Observation: observation,
                    IsFollowUpNeeded: radioValue,
                    ObservationDate: dateValue,
                    ObservationTime: timeValue,	
                    DescribeWhereTheIncidentHappened: whereObservationHappened
                }
                const result = await api.post({
                    url: 'api/Observation/SaveAnonymousObservation',
                    body: payload
                })
                if( !isEmpty( result ) && imagesArray.length > 0 ) {
                    const response = await api.imageUpload({
                            image: imagesArray[0],
                            url: `api/Observation/Upload?ObservationID=${result}`
                    })
                    if( isEmpty( response ) ) {
                        return null
                    }
                    navigation.navigate( 'Home' )
                }else if( !isEmpty( result ) && imagesArray.length === 0 ) {
                    navigation.navigate( 'Home' )
                }else{
                    return null
                }
            }catch( error ) {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
                return null
            }finally {
                setIsButtonAnonymously( false )    
            }
            return result
        }
    }

    const onImageReceive = ( url, imageData ) => {
        const imageObj = { ...imageData, uri: url }
        setImagesArray( imagesArray => [...imagesArray, imageObj ])
    }

    const navigateToImagePicker = ( ) => {
        navigation.navigate( 'UploadImage', {
            callback: ( url, imageData ) => onImageReceive( url, imageData )
        } )
    }

    const getActValue = ( id ) => {
        if( isEmpty( id ) ) return null
        const currentActObject = actList.find( item => {
            if( item.value === String( id ) ) return item
        })
        setActValue( currentActObject.value )
        setActText( currentActObject.label )
    }


    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const documentPicker = ( ) => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            console.log(
              res.uri,
              res.type, 
              res.name,
              res.size
            );
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
              Toast.showWithGravity(err.Message, Toast.LONG, Toast.TOP);
              return null
            } else {
              Toast.showWithGravity(err.Message, Toast.LONG, Toast.TOP);
              return null
            }
          }
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent isEnabled={isEnabled} toggleSwitch={toggleSwitch}/>
            <View style={{ flex: 0.9, marginHorizontal: '3%' }}>
                <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true}  keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, marginTop: '3%'}}>
                        <AutoCompleteInput
                            style={{ color: 'black', borderColor: 'red' }}
                            data={autoCompleteValue.length === 0 && !shouldHideResults ? autoCompleteList : filteredData}
                            renderItem={renderItem}
                            hideResults={shouldHideResults}
                            containerStyle={{flex:1, zIndex: 1}}
                            renderTextInput={renderTextInput}
                            keyExtractor={(i) => String( i ) }
                            maxListHeight={400}
                            flatListProps={{ nestedScrollEnabled: true }}
                        />
                    </View>
                    <View>
                        <Input
                            label="*  Describe where the Observation happened"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Type Here"
                            inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                            placeholderTextColor="#9EA0A4"
                            inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                            onChangeText={(text)=> setWhereObservationHappened( text )}
                            value={whereObservationHappened}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="*  What was the Date of the Observation"
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
                    <View>
                        <CustomDateTimePicker
                            label="*  What was the Time of the Observation"
                            show={showTime}
                            display="spinner"
                            placeholder="Select Time"
                            customRightIcon={{ name: 'time-outline', type: 'ionicon', size: 24 ,color:'#1e5873' }}
                            onPress={showTimepicker}
                            inputValue={timeValue}
                            mode={mode}
                            value={date}
                            onConfirm={onChangeTime}
                            onCancel={hideTimePicker}
                        />
                    </View>
                    <View>
                        <View style={{ marginBottom: 10, }}>
                            <Text style={{
                                color: '#86939e',
                                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                            }}>  Follow up needed </Text>
                            <RadioForm style={{ marginLeft: 100 }}
                                radio_props={radioButtons}
                                initial={1}
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
                    </View>
                    <View>
                        <CustomDropdown
                            title="Section"
                            items={sectionList}
                            value={sectionValue}
                            onValueChange={onSectionValueChange}
                        />
                        <CustomDropdown
                            title="Topic"
                            items={topicList}
                            value={topicValue}
                            onValueChange={(value) => setTopicValue(value)}
                        />
                        <CustomDropdown
                            title="*  Act or Condition"
                            value={actValue}
                            onValueChange={getActValue}
                            items={actList}
                        />
                        <CustomDropdown
                            title={actText && actText.startsWith("Unsafe") ? "Hazard" : "Preventive Hazard"}
                            items={hazardList}
                            value={hazardValue}
                            onValueChange={(value) => setHazardValue(value)}
                        />
                    </View>
                    <View style={{ marginTop: '2.5%' }}>
                        <Input
                            label="*  Observation"
                            labelStyle={{ marginBottom: 5 }}
                            enablesReturnKeyAutomatically={true}
                            multiline={true}
                            returnKeyLabel="done"
                            textAlignVertical="top"
                            placeholder="Type Here"
                            placeholderTextColor="#9EA0A4"
                            inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                            inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                            onChangeText={(text)=> setObservation( text )}
                            value={observation}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                    {
                        imagesArray.length > 0 &&
                    imagesArray.map( ( item, index ) => {
                        if( index >= 2 ) {
                            return null
                        }
                        return (
                            <View key={index} style={{ width: 100, height: 100, marginHorizontal: '5%', flexDirection: 'row'}}>
                                <Image
                                    source={{ uri: item.uri }}
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
                    } )
                        }
                        </View>
                </ScrollView>
            </View>
            <View style={{position: 'absolute', bottom: keyboard.keyboardShown ? '15%' : '10%' , right: 10, left: '85%'}}>
                <Avatar size="medium" rounded icon={{ name: 'camera', type:'feather'}} containerStyle={{ backgroundColor: '#1e5873'}} onPress={navigateToImagePicker}/>
                <Avatar size="medium" rounded icon={{ name: 'file-pdf-o', type: 'font-awesome' }} containerStyle={{ marginTop: '30%',color:'red' ,backgroundColor: '#1e5873'}} onPress={documentPicker}/>
            </View>
            <View style={{ flex: 0.1}}>
                {
                    isEnabled 
                    ?  <View style={{ flex: 0.8, marginTop: '1%'}}>
                            <Button containerStyle={{ marginHorizontal: '5%'}}  icon={{ name: 'incognito', type:'material-community', color:'white'}} title="Submit as Anonymous" titleStyle={{ fontSize: 14 }} buttonStyle={{ backgroundColor: '#1e5873', width: '100%', padding: 15 }} onPress={submitFormAnonymously} loading={isButtonAnonymously}/>
                        </View>
                    :  <View style={{ flex: 0.8, marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                            <Button icon={{ name: 'save', type: 'FontAwesome',color:'white'}} title="Submit" titleStyle={{ fontSize: 14 }}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={submitForm} loading={isButtonLoading}/>
                            <Button icon={{ name: 'content-save-edit', type:'material-community',color:'white' }}  title="Save & Come Back" titleStyle={{ fontSize: 14 }} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={saveAndComeBack} loading={isButtonComeBack}/>
                        </View>
                }
            </View>
            {
                keyboard.keyboardShown
                ? <View style={{ height: Platform.OS === 'ios' ? '30%' : '3%' }} />
                : null
            }
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
