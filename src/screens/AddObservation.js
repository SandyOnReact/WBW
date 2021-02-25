import React, { useState, useEffect } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
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

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }


   
    const toggleOverlay = ( ) => {
        setIsVisible( false )
    }

    if( isVisible ) {
        return (
            <OverlayComponent isVisible={isVisible} treeData={family} onBackdropPress={toggleOverlay} />
        )

    }

    const getLocations = async () => {
        // const user = await fetchUserInfoFromStorage()
        // console.log( user )
        // const token = await AsyncStorage.getItem('Token')
        // const LOCATION_URL = `api/Common/GetLocations?UserID=${user.UserID}&AccessToken=${token}&LevelID=${user.LevelID}`
        // const result = await api.get( {
        //     url: LOCATION_URL
        // } )



       

        const data = [
            {
                LevelID: "D1FA00FA-419F-465C-8694-0838066C3011",
                LevelName: "XYZ Energy",
                Children: {
                    LevelID: "3651E8B9-1D0A-48B7-B644-1F33C5356BC2",
                    LevelName: "Houston",
                    Children: [
                        {
                            LevelID: "2A513538-3CBB-43C4-8282-4B58DE744496",
                            LevelName: "my new level1"
                        },
                        {
                            LevelID: "0726343B-3911-4AB7-BD9C-E59A5D8E3B4F",
                            LevelName: "X1 Refinery",
                            Children: {
                                LevelID: "9A7C5D14-BA50-4C55-89DA-7702072D25A3",
                                LevelName: "X - div1",
                                Children: {
                                    LevelID: "A6E6789B-2D83-41CB-B9DD-A94DE20E635C",
                                    LevelName: "p1 - department1"
                                }
                            }
                        },
                        {
                            LevelID: "6D6E0E5F-65F5-4679-91EA-4A083295A777",
                            LevelName: "X2 Refinery",
                            Children: [
                                {
                                    LevelID: "53506422-70E1-4CA2-9B5C-BE37F3F09C45",
                                    LevelName: "PA1 & a"
                                },
                                {
                                    LevelID: "42109DFC-961F-4613-A5FA-4C8AD37D645C",
                                    LevelName: "PA2's",
                                    Children: {
                                        LevelID: "EB3081FF-8DF5-45C0-A4AB-1847611CB1D3",
                                        LevelName: "PA2.1"
                                    }
                                },
                                {
                                    LevelID: "D367238D-5AC1-4D9D-8D06-3D18C8E637F1",
                                    LevelName: "PA3",
                                    Children: {
                                        LevelID: "23E9A819-9992-44F1-A572-1A0BA078233A",
                                        LevelName: "PA3.1"
                                    }
                                },
                                {
                                    LevelID: "07AE2452-DE4E-4E14-A573-A0582FE404DE",
                                    LevelName: "PA4"
                                },
                                {
                                    LevelID: "204C6835-B507-469A-B9B8-E50DB3728087",
                                    LevelName: "PA5"
                                },
                                {
                                    LevelID: "21E374F8-2C4C-4BEB-A41F-502D4C667902",
                                    LevelName: "PA6"
                                }
                            ]
                        },
                        {
                            LevelID: "0C8FF5BF-0946-438B-ABDD-A6DE0C6E3DA4",
                            LevelName: "Region 1",
                            Children: [
                                {
                                    LevelID: "89A00FF0-720F-47AA-8CD8-29E07391FAB4",
                                    LevelName: "Location 1"
                                },
                                {
                                    LevelID: "60E4BD57-E60D-488B-AF18-B009EE450F0A",
                                    LevelName: "Location 2"
                                },
                                {
                                    LevelID: "15057A2E-A51C-481B-A070-058675B6AE6E",
                                    LevelName: "Location 3"
                                }
                            ]
                        },
                        {
                            LevelID: "31C60616-B511-44F1-BCF0-87F2D7EBF33F",
                            LevelName: "Region 2",
                            Children: [
                                {
                                    LevelID: "9D528451-AD9A-41D2-825A-8473744B277C",
                                    LevelName: "Location 1"
                                },
                                {
                                    LevelID: "6FF573A1-57E6-45B6-8140-E146A3160A0C",
                                    LevelName: "Location 2"
                                }
                            ]
                        },
                        {
                            LevelID: "35E665E1-B4F1-41F6-97AC-67B2611C9797",
                            LevelName: "Region 3",
                            Children: [
                                {
                                    LevelID: "026376A9-1FB6-433D-9495-1B6CEF9944CC",
                                    LevelName: "Location 1"
                                },
                                {
                                    LevelID: "2EBD0FA1-4DF9-457B-AD05-0CD5D334C0CB",
                                    LevelName: "Location 2",
                                    Children: [
                                        {
                                            LevelID: "B1094E92-E08F-4498-B8E5-1CD187F0E8D6",
                                            LevelName: "Area 1"
                                        },
                                        {
                                            LevelID: "C3754EAF-610E-4DB4-B200-0FFE5BEF6F0D",
                                            LevelName: "Area 2"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            LevelID: "D1EFC844-6176-4D1F-B28B-CB51EA55FF81",
                            LevelName: "Region 4",
                            Children: {
                                LevelID: "F893A4EF-0311-44FE-B7F6-06A29379AA38",
                                LevelName: "Area 1"
                            }
                        }
                    ]
                }
            }
        ]
        console.log( 'call')
        setIsVisible( true )
       
        // return (
        //     <TreeView
        //         data={family} // defined above
        //         renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
        //             return (
        //                 <View>
        //                     <Text
        //                         style={{
        //                             marginLeft: 25 * level,
        //                         }}
        //                     >
        //                         {getIndicator(isExpanded, hasChildrenNodes)} {node.name}
        //                     </Text>
        //                 </View>
        //             )
        //         }}
        //     />

        // )

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
                                <Button title="Select" type="clear" containerStyle={{ flex: 1, marginHorizontal: '2%' }} onPress={getLocations} />
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
                            onValueChange={(value) => console.log(value)}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={[
                                { label: 'Football', value: 'football' },
                                { label: 'Baseball', value: 'baseball' },
                                { label: 'Hockey', value: 'hockey' },
                            ]}
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
                            onValueChange={(value) => console.log(value)}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={[
                                { label: 'Football', value: 'football' },
                                { label: 'Baseball', value: 'baseball' },
                                { label: 'Hockey', value: 'hockey' },
                            ]}
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
                            onValueChange={(value) => console.log(value)}
                            useNativeAndroidPickerStyle={false}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            items={[
                                { label: 'Football', value: 'football' },
                                { label: 'Baseball', value: 'baseball' },
                                { label: 'Hockey', value: 'hockey' },
                            ]}
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
        borderColor: '#86939e',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
