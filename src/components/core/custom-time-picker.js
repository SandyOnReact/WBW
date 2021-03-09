import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from 'react-native-elements'

const containerStyle = {
    borderWidth: 1,
    borderColor: '#1e5873',
    borderRadius: 6
}
const TimePicker = (props) => {
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
        onPress
    } = props

    const defaultRightIcon = {
        type: 'ionicon',
        name: 'time-outline',
        onPress: onRightIconPress
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
                placeholderTextColor={placeholderTextColor}
                textAlignVertical={textAlignVertical}
                rightIcon={rightIcon}
                inputContainerStyle={[containerStyle, inputContainerStyle]}
            />
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    mode={mode}
                    minuteInterval={minuteInterval}
                    is24Hour={is24Hour}
                    display={display}
                    onChange={onChange}
                />
            )}
        </TouchableOpacity>
    )
}

export const CustomTimePicker = React.memo( TimePicker, showPickerProps)

const showPickerProps = ( nextProps, prevProps ) => {
    return (
        nextProps.show === prevProps.show
    )
}
TimePicker.defaultProps = {
    mode: 'time',
    minuteInterval: 10,
    is24Hour: false,
    numOfLines: 1,
    multiline: false,
    editable: false,
    label: '',
    placeholder: 'Type Something',
    placeholderTextColor: 'grey',
    textAlignVertical: 'center',
    inputContainerStyle: { },
    show: false,
    display: 'default',
    onRightIconPress: ( ) => null,
    inputValue: ''
}
