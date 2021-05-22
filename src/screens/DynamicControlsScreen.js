import { isEmpty } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { api } from '../utils/api'
import { useRoute } from '@react-navigation/native';
import { Input, Header, Button, CheckBox } from "react-native-elements"
import _ from "lodash"
import { CustomDropdown } from '../components/core/custom-dropdown'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useNavigation } from "@react-navigation/native"
import { CustomDateTimePicker } from '../components/datetimepicker'
import moment from 'moment';

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

const CustomInput = ( { value } ) => {
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
                editable={value.LinkText === 'Edit' ? true : false }
            />
        </View>
    )
}

const EditableDropdown = ( { value } ) => {
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
const CustomCalendar = ( { value } ) => {
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

const CustomCheckBox = ( { value } ) => {
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

let dropdownValue = ''
export const DynamicControlsScreen = ( props ) => {
    const route = useRoute();
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const [dynamicControls,SetDynamicControls] = useState( [] | undefined )
    const navigation = useNavigation()
    
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
                            case 'RadioButton':
                                return null
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
            <View style={{ flex: 0.94 }}>
                <FlatList 
                    data={dynamicControls}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String( index )}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </View>
            <View style={{ flex: 0.06, marginVertical: '3%', marginHorizontal: '3%' }}>
                <Button  title="Submit" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} />
            </View>
        </View>
    )
}

