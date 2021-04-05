import React, { memo } from 'react'
import { View, Text } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';

const containerStyle = {
    borderWidth: 1,
    borderColor: '#1e5873',
    borderRadius: 6
}
export const CustomDateTimePicker = memo( (props) => {
    const {
        customRightIcon,
        numOfLines,
        multiline,
        editable,
        label,
        placeholder,
        placeholderTextColor,
        textAlignVertical,
        inputContainerStyle,
        show,
        onRightIconPress,
        onChange,
        value,
        mode,
        is24Hour,
        minuteInterval,
        customLabelStyle,
        display,
        inputValue,
        onPress,
        onConfirm,
        onCancel,
        maximumDate
    } = props

    const defaultRightIcon = {
        type: 'font-awesome',
        name: 'calendar',
        color: '#1e5873'
    }

    const rightIcon = customRightIcon || defaultRightIcon

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <Input
                numberOfLines={numOfLines}
                multiline={multiline}
                editable={editable}
                label={label}
                value={inputValue}
                labelStyle={[{ marginBottom: 5 }, customLabelStyle]}
                placeholder={placeholder}
                textAlignVertical={textAlignVertical}
                rightIcon={rightIcon}
                placeholderTextColor="#9EA0A4"
                inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                inputContainerStyle={[containerStyle, inputContainerStyle]}
            />
                <DateTimePickerModal
                    testID="dateTimePicker"
                    value={value}
                    mode={mode}
                    isVisible={show}
                    minuteInterval={minuteInterval}
                    is24Hour={is24Hour}
                    display={display}
                    onChange={onChange}
                    maximumDate={maximumDate}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            
        </TouchableOpacity>
    )
}, ( prevProps, nextProps ) => {
    prevProps.inputValue === nextProps.inputValue
})

CustomDateTimePicker.defaultProps = {
    mode: 'time',
    minuteInterval: 10,
    is24Hour: false,
    numOfLines: 1,
    multiline: false,
    editable: false,
    label: '',
    placeholder: 'Select Date',
    placeholderTextColor: 'grey',
    textAlignVertical: 'center',
    inputContainerStyle: { },
    show: false,
    display: 'default',
    onRightIconPress: ( ) => null,
    inputValue: '',
    onConfirm: ( ) => null,
    onCancel: ( ) => null
}
