import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, ActivityIndicator } from 'react-native'
import { Input, Header, Button } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native"
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useFormik } from "formik"
import { string, object } from 'yup'
import RNPickerSelect from 'react-native-picker-select';
import { CustomDropdown } from '../components/core/custom-dropdown'
import { CustomDateTimePicker } from '../components/datetimepicker'
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import Autocomplete from 'react-native-autocomplete-input';
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'

let date = new Date()
const radioButtons = [
    { label: 'Yes', value: 0 },
    { label: 'No', value: 1 }
]
export const AddObservationScreen = () => {

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
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
    const [topicList, setTopicList] = useState([]);
    const [sectionValue, setSectionValue] = useState('');
    const [topicValue, setTopicValue] = useState('');
    const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    const {
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        isValidating,
        isSubmitting,
        resetForm,
    } = useFormik({
        initialValues: {
            whereDidObservationOccur: "",
            whereDidObservationHappened: "",
            Observation: "",
        },
        validationSchema: object({
            whereDidObservationOccur: string()
                .required('This field is required'),
            whereDidObservationHappened: string()
                .required('This field is required'),
            observation: string()
                .required('This field is required')
        }),
        async onSubmit({ whereDidObservationOccur, whereDidObservationHappened, observation }) {
            //
        }
    })

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    } 

    useEffect(()=> {
        getAllData()
    }, [] )

    const getAllData = async ( ) => {
        const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const result = await api.post({
            url: `api/Common/GetAllFilters`,
            body: {
                UserID: user.UserID,
                AccessToken: token,
                CompanyID: user.CompanyID,
                ObservationSettingID: 'aa7309ab-5bd8-4f2d-9b29-5f19d27495a8'
            }
        })
        if (result === "Invalid User Token") {
            Toast.showWithGravity('Invalid User Token', Toast.LONG, Toast.CENTER);
            return null;
        }
        if( !result.ActOrConditions ) {
            return null
        }

        if( !result.Sections ) {
            return null
        }

        if( !result.ObservationTime ){
            return null
        }
        setData( result )
        const actData = result.ActOrConditions.map( item => {
            const act = { label: item.Value, value: item.Value }
            return act;
        }, [] )
        const hazardData = result.Hazards.map( item => {
            const hazard = { label: item.Value, value: item.Value }
            return hazard;
        }, [] )
        
        const topicData = []
        const sectionData = result.Sections.map( (item, index) => {
            const section = { label: item.Value, value: item.Value }
            item.Topics.map( obj => {
                const topic = { label: obj.Value, value: obj.Value }
                topicData.push( topic )
                return topic
            } )
            return section;
        })
        setSectionList( sectionData )
        setTopicList( topicData )
        setActList( actData )
        setHazardList( hazardData )
        setIsLoading( false )
        return result;
    }

    if( isLoading ) {
        return(
            <ActivityIndicator color="red"/>
        )
    }

    const onChange = (event, selectedDate) => {
        if( event.type === "dismissed" ) return null
        const currentDate = selectedDate || date;
        console.log( currentDate )
        setShow(false);
        if (mode === 'date') {
            const pickedDate = moment(currentDate).format("DD/MM/YYYY")
            setDateValue(pickedDate)
            date = currentDate
        } else {
            const pickedTime = moment(currentDate).format("hh:mm a")
            setTimeValue(pickedTime)
            date = currentDate
        }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Header
                    containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                    statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                    containerStyle={{ backgroundColor: '#1e5873' }}
                    leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                    centerComponent={{ text: 'Add Observation', style: { color: '#fff', fontSize: 16 } }}
                />
            </View>
            <View style={{ flex: 1, marginHorizontal: '5%' }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginTop: '3%' }}>
                        <Input
                            label="Where Did Observation Occur"
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("whereDidObservationOccur")}
                            onBlur={handleBlur("whereDidObservationOccur")}
                            errorMessage={errors.whereDidObservationOccur}
                        />
                    </View>
                    <View>
                        <Input
                            label="Describe Where the Observation Happened"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("whereDidObservationHappened")}
                            onBlur={handleBlur("whereDidObservationHappened")}
                            errorMessage={errors.whereDidObservationHappened}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="What was the Date of Observation"
                            onRightIconPress={showDatepicker}
                            show={show}
                            inputValue={dateValue}
                            mode={mode}
                            display="spinner"
                            value={date}
                            onChange={onChange}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="What was the Time of Observation"
                            onRightIconPress={showTimepicker}
                            show={show}
                            display="spinner"
                            inputValue={timeValue}
                            mode={mode}
                            value={date}
                            onChange={onChange}
                        />
                    </View>
                    <View>
                        <View style={{ marginBottom: 10, }}>
                            <Text style={{
                                color: '#86939e',
                                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                            }}> Follow Up Needed: </Text>
                            <RadioForm style={{ marginLeft: 100 }}
                                radio_props={radioButtons}
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#86939e'}
                                selectedButtonColor={'#1e5873'}
                                animation={true}
                                style={{ paddingHorizontal: 15, justifyContent: 'space-between' }}
                                onPress={(value) => setRadioValue(value)}
                            />
                        </View>
                    </View>
                    <View>
                        <CustomDropdown
                            title="Section"
                            items={sectionList}
                            value={sectionValue}
                            onValueChange={(value) => setSectionValue( value )}
                        />
                        <CustomDropdown
                            title="Topic"
                            items={topicList}
                            value={topicValue}
                            onValueChange={(value) => setTopicValue( value )}
                        />
                        <CustomDropdown
                            title="Act or Condition"
                            value={actValue}
                            onValueChange={(value) => setActValue( value )}
                            items={actList}
                        />
                        <CustomDropdown
                            title={actValue && actValue.startsWith( "Unsafe" ) ? "Hazard" : "Preventive Hazard"}
                            items={hazardList}
                            value={hazardValue}
                            onValueChange={(value) => setHazardValue( value )}
                        />
                    </View>
                    <View style={{ marginTop: '2.5%' }}>
                        <Input
                            label="Observation"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("observation")}
                            onBlur={handleBlur("observation")}
                            errorMessage={errors.observation}
                        />
                    </View>
                    <View>
                        <Button title="Submit" />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    }
})
