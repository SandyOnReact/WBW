import React, { useState } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { Header, Input, Icon, Button } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useFormik } from "formik"
import { string, object } from 'yup'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioForm from 'react-native-simple-radio-button';
import RNPickerSelect from 'react-native-picker-select';

const radioButtons = [
    { label: 'Yes', value: 0 },
    { label: 'No', value: 1 }
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

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "dark-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Add Observation', style: { color: '#fff' } }}
            />
            <View style={{ flex: 1, margin: '4%' }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                            color: '#86939e', fontFamily: 'sans-serif',
                            fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                        }}> Follow Up Needed: </Text>
                        <RadioForm
                            radio_props={radioButtons}
                            initial={0}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonColor={'#86939e'}
                            selectedButtonColor={'#1e5873'}
                            animation={true}
                            style={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
                            onPress={(value) => setRadioValue(value)}
                        />
                    </View>
                    <View style={{ marginBottom: '3%' }}>
                        <Text style={{
                            color: '#86939e', fontFamily: 'sans-serif',
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
                            color: '#86939e', fontFamily: 'sans-serif',
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
                            color: '#86939e', fontFamily: 'sans-serif',
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
