import { isEmpty } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { api } from '../utils/api'
import { useRoute } from '@react-navigation/native';
import { Input, Header, Button, CheckBox } from "react-native-elements"
import _, { filter, findIndex, findLastIndex } from "lodash"
import { CustomDropdown } from '../components/core/custom-dropdown'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation } from "@react-navigation/native"
import { CustomDateTimePicker } from '../components/datetimepicker'
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import { useKeyboard } from '@react-native-community/hooks';


const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

export const CustomInput = ( { value } ) => {
    const [inputValue,setInputValue] = useState( value.SelectedValue )
    return (
        <View>
            <Input
                label={value.ControlLabel}
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Type Here"
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

export const EditableDropdown = ( { value } ) => {
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
                title={value.ControlLabel}
                items={controlValues}
                value={dropdownValue}
                onValueChange={onValueChange}
            />
        </View>
    )
}

let date = new Date();
export const CustomCalendar = ( { value } ) => {
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
                label={value.ControlLabel}
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

export const CustomCheckBox = ( { value } ) => {
    const [checkboxValue, setCheckboxValue] = useState( false )

    const toggleCheckBoxValue = ( ) => {
        setCheckboxValue( checkboxValue => !checkboxValue )
    }
    return (
        <View style={{ backgroundColor: 'transparent'}}>
            <CheckBox
                title={value.ControlLabel}
                checked={checkboxValue}
                onPress={toggleCheckBoxValue}
            />
        </View>
    )
}

export const CustomMultiSelectCheckbox = ( { value } ) => {
    const [selectedCheckbox, setSelectedCheckbox] = useState( [] )

    const toggleCheckBox = async ( item ) => {
       if( selectedCheckbox.includes( item.Id ) ) {
           setSelectedCheckbox( prevState => prevState.filter( value => value !== item.Id ))
        }else if( !item.checked && !selectedCheckbox.includes( item.Id )){
           setSelectedCheckbox( prevState => [...prevState, item.Id ] )
       }  
    }

    return (
        <View style={{ backgroundColor: 'transparent'}}>
            <Text style={{
                color: '#86939e',
                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '2%'
            }}>{value.ControlLabel}</Text>
            {
                value.ControlValues.map( item => {
                    return (
                        <View key={item.Id}>
                            <CheckBox
                            title={item.Value}
                            checked={selectedCheckbox.includes( item.Id )}
                            onPress={()=>toggleCheckBox( item )}
                        />
                        </View>
                    )
                })
            }
        </View>
    )
}

export const CustomRadioButtonList = ( { value } ) => {
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
            }}>{value.ControlLabel}</Text>
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

const CustomTextAreaInput = ( { value } ) => {
    const [inputValue,setInputValue] = useState( value?.SelectedValue )
    return (
        <View>
            <Input
                label={value.ControlLabel}
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

export const DynamicControlsScreen = ( props ) => {
    const route = useRoute();
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const [dynamicControls,SetDynamicControls] = useState( [] | undefined )
    const navigation = useNavigation()
    const keyboard = useKeyboard()
    
    useEffect( ( ) => {
        fetchDynamicControls()
    }, [] )

    const fetchDynamicControls = async ( ) => {
        const result = await api.get( {
            url: 'api/POC/GetDynamicControls'
        } )
        if( isEmpty( result ) ) {
            return null
        }
        const sortedArrayByGroupOrder = _.sortBy(result, [function(o) { return o.GroupOrder; }]);
        SetDynamicControls( sortedArrayByGroupOrder )
    }

    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    const renderItem = ( { item } ) => {
        const sortedArrayByDisplayOrder = _.sortBy(item.DynamicControls, [function(o) { return o.DisplayOrder; }]);
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#1e5873', height: 50, marginVertical: '3%', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%' }}>
                    <Text style={{ textAlign: 'center', color: 'white'}}>{item.GroupName}</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: '3%' }}>
                {
                    sortedArrayByDisplayOrder.map( value => {
                        switch( value.ControlType ) {
                            case 'Textbox': {
                                return (
                                   <CustomInput value={value} />
                                )
                            }
                            case 'DropDownList':                               
                                return (
                                   <EditableDropdown value={value} />
                                )
                            case 'Calendar':
                                return (
                                    <CustomCalendar value={value}/>
                                )
                            case 'Checkbox':
                                return (
                                    <CustomCheckBox value={value}/>
                                )
                            case 'CheckBoxList':
                                return (
                                    <CustomMultiSelectCheckbox value={value} />
                                )
                            case 'RadioButtonList':
                                return (
                                    <CustomRadioButtonList value={value} />
                                )
                            case 'TextArea':
                                return (
                                    <CustomTextAreaInput value={value}/>
                                )
                        }
                    })
                }
                </View>
            </View>
        )
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <View height={24} />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Dynamic Controls', style: { color: '#fff', fontSize: 16 } }}
            />
            <View style={{ flex: keyboard.keyboardShown ? 0.92 : 0.94 }}>
                <FlatList 
                    data={dynamicControls}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String( index )}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </View>
            <View style={{ flex: keyboard.keyboardShown ? 0.08 : 0.06, marginVertical: '5%', marginHorizontal: '3%' }}>
                <Button  title="Submit" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} />
            </View>
        </View>
    )
}

