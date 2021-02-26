import React, { useState, useEffect } from 'react'
import { View, Text, Platform, StyleSheet, ActivityIndicator } from 'react-native'
import { Header, Input, Icon, Button } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useFormik } from "formik"
import { string, object } from 'yup'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioForm from 'react-native-simple-radio-button';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'

import { OverlayComponent } from '../components/overlay-component'


const radioButtons = [
    { label: 'Yes', value: 0 },
    { label: 'No', value: 1 }
]

const family = [
    {
      id: 'Grandparent',
      name: 'Grandpa',
      age: 78,
      children: [
        {
          id: 'Me',
          name: 'Me',
          age: 30,
          children: [
            {
              id: 'Erick',
              name: 'Erick',
              age: 10,
            },
            {
              id: 'Rose',
              name: 'Rose',
              age: 12,
            },
          ],
        },
      ],
    },
  ]

  let sectionValue = ''
  let topicValue = ''
  let actValue = ''

export const AddObservationScreen = ({ navigation }) => {
    const navigatetoBackScreen = () => {
        navigation.goBack()
    }
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [radioValue, setRadioValue] = useState(undefined)
    const [isVisible, setIsVisible] = useState(false);
    const [data,setData] = useState( false )
    const [sectionData,setSectionData] = useState( [] )
    const [topicData,setTopicData] = useState( [] )
    const [actData,setActData] = useState( [] )
    const [isLoading,setIsLoading] = useState( true )


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
            username: "",
            password: "",
        },
        validationSchema: object({
            username: string()
                .required(),
            password: string()
                .required()
                .min(6)
        }),
        async onSubmit() {
            //
        },
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
                CompanyID: 'd1fa00fa-419f-465c-8694-0838066c3011',
                ObservationSettingID: 'aa7309ab-5bd8-4f2d-9b29-5f19d27495a8'
            }
        })
        if (result === "Invalid User Token") {
            Toast.showWithGravity('Invalid User Token', Toast.LONG, Toast.CENTER);
            return null;
        }
        setData( result )
        if( !result.ActOrConditions ) {
            return null
        }

        const actList = result.ActOrConditions.map( item => {
            const act = { label: item.Value, value: item.Value }
            return act;
        }, [] )

        if( !result.Sections ) {
            return null
        }
        const topicList = []
        const sectionsList = result.Sections.map( (item, index) => {
            const section = { label: item.Value, value: item.Value }
            item.Topics.map( obj => {
                const topic = { label: obj.Value, value: obj.Value }
                topicList.push( topic )
                return topic
            } )
            return section;
        })
        setSectionData( sectionsList )
        setTopicData( topicList )
        setActData( actList )
        setIsLoading( false )
        return result;
    }

    if( isLoading ) {
        return(
            <ActivityIndicator color="red"/>
        )
    }



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
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

    const onImageUploadPress = () => {

    }

    const toggleOverlay = ( ) => {
        setIsVisible( false )
    }

    if( isVisible ) {
        return (
            <OverlayComponent isVisible={isVisible} treeData={family} onBackdropPress={toggleOverlay} />
        )

    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Add Observation', style: { color: '#fff',fontSize:16 } }}
            />
            <View style={{ flex: 1, margin: '4%' }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <Input
                            numberOfLines={1}
                            multiline={true}
                            label='Where Did Observation occur'
                            labelStyle={{ marginBottom: 5 }}
                            editable={false}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            textAlignVertical='center'
                            rightIcon={
                                <Button title="Select" type="clear" containerStyle={{ flex: 1, marginHorizontal: '2%' }} />
                            }
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                    </View>
                    <View>
                        <Input
                            numberOfLines={3}
                            multiline={true}
                            label='Describe where the incident happened'
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            textAlignVertical='top'
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                    </View>
                    <View>
                        <Input
                            numberOfLines={1}
                            multiline={true}
                            label='What was the Date of the Observation'
                            labelStyle={{ marginBottom: 5 }}
                            editable={false}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            textAlignVertical='center'
                            rightIcon={{ type: 'font-awesome', name: 'calendar', onPress: showDatepicker }}
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                minuteInterval={10}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </View>
                    <View>
                        <Input
                            numberOfLines={1}
                            multiline={true}
                            editable={false}
                            label='What was the Time of the Observation'
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            textAlignVertical='center'
                            rightIcon={{ type: 'font-awesome', name: 'calendar', onPress: showTimepicker }}
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                minuteInterval={10}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? "spinner" : "default"}
                                onChange={onChange}
                            />
                        )}
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{
                            color: '#86939e',
                            fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                        }}> Follow Up Needed: </Text>
                        <RadioForm style={{marginLeft:100}}
                            radio_props={radioButtons}
                            initial={0}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonColor={'#86939e'}
                            selectedButtonColor={'#1e5873'}
                            animation={true}
                            style={{ paddingHorizontal: 15 }}
                            onPress={(value) => setRadioValue(value)}
                        />
                    </View>
                    <View style={{ marginBottom: '3%' }}>
                        <Text style={{
                            color: '#86939e',
                            fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                        }}> Section </Text>
                        <RNPickerSelect
                            onValueChange={(value) => sectionValue = value }
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={sectionData}
                            Icon={() => {
                                return <Icon name="caret-down" color="gray" size={24} type="ionicon" />;
                            }}
                        />
                    </View>

                    <View style={{ marginBottom: '3%' }}>
                        <Text style={{
                            color: '#86939e',
                            fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                        }}> Topic </Text>
                        <RNPickerSelect
                            onValueChange={(value) => topicValue = value}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={topicData}
                            Icon={() => {
                                return <Icon name="caret-down" color="gray" size={24} type="ionicon" />;
                            }}
                        />
                    </View>

                    <View style={{ marginBottom: '3%' }}>
                        <Text style={{
                            color: '#86939e', 
                            fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                        }}> Act or Condition </Text>
                        <RNPickerSelect
                            onValueChange={(value) => actvalue = value }
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={actData}
                            Icon={() => {
                                return <Icon name="caret-down" color="gray" size={24} type="ionicon" />;
                            }}
                        />
                    </View>

                    <View>
                        <Input
                            numberOfLines={3}
                            multiline={true}
                            label='Observation'
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            textAlignVertical='top'
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                    </View>

                    <View>
                        <Input
                            label='Upload Image'
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            editable={false}
                            textAlignVertical='top'
                            rightIcon={{ type: 'feather', name: 'upload', onPress: onImageUploadPress }}
                            inputContainerStyle={{ borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }}
                        />
                    </View>

                    <Button
                        title="Submit"
                        buttonStyle={{ backgroundColor: '#1e5873', marginHorizontal: '3%', padding: 10, borderRadius: 7 }}
                        containerStyle={{ marginBottom: 10 }}
                    />

                </ScrollView>
            </View>
        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: '2.7%',
        borderRadius: 8,
        borderWidth: 1,
        color: 'black',
        borderColor: '#86939e',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
