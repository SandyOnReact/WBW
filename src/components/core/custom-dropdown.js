import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Icon } from "react-native-elements"

const defaultIcon = () => {
    return <Icon name="caret-down" color="#1e5873" size={24} type="ionicon" />;
}

export const CustomDropdown = memo( ( props ) => {
    const {
        items,
        title,
        placeholder,
        value,
        onValueChange,
        useNativeAndroidPickerStyle,
        style,
        textInputProps,
        touchableWrapperProps,
        onOpen,
        customIcon,
        customTitleStyle,
        error,
        onDonePress
    } = props

    const Icon = customIcon || defaultIcon


    const myPickerStyles = {
        ...styles, 
        iconContainer: { 
            top: 10,
            right: 12, 
        } 
    }

    const titleStyle = {
        color: '#86939e',
        fontWeight: 'bold', 
        fontSize: 16, 
        marginBottom: '1%'
    }

    const errorStyle = {  
        paddingLeft: '3%', 
        marginTop: '2%' 
    }

    return (
        <View style={{ flex: 1,margin:"2.5%", marginVertical: '2.5%' }}>
            <View>
                <Text style={[titleStyle,customTitleStyle]}>{title}</Text>
            </View>
            <RNPickerSelect
                key={value}
                items={items}
                value={value}
                onValueChange={onValueChange}
                useNativeAndroidPickerStyle={useNativeAndroidPickerStyle}
                style={myPickerStyles}
                textInputProps={textInputProps}
                touchableWrapperProps={touchableWrapperProps}
                onOpen={onOpen}
                Icon={Icon}
                fixAndroidTouchableBug={true}
                onDonePress={onDonePress}
            />
            {
                error && (
                    <View style={[errorStyle,customErrorStyle]}>
                        <Text style={{ fontSize: 14, color: 'red'}}>{error}</Text>
                    </View>
                )
            }
        </View>
    )
}, ( prevProps, nextProps ) => {
    prevProps.value === nextProps.value
})


const styles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#1e5873',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
        },
        inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            color: 'black',
            borderColor: '#1e5873',
            paddingRight: 30,
        },
})

CustomDropdown.defaultProps = {
    items: [],
    value: '',
    onValueChange: ( ) => null,
    useNativeAndroidPickerStyle: false,
    textInputProps: { },
    touchableWrapperProps: { },
    onOpen: ( ) => null,
    customTitleStyle: { }
}