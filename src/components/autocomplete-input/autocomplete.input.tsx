import React, { FunctionComponent } from "react"
import AutoComplete from 'react-native-autocomplete-input'
import { View, StyleSheet, ViewStyle } from "react-native"

// export type AutoCompleteInputProps = {
//     outerContainerStyle?: ViewStyle,
//     placeholder?: string,
//     placeholderTextColor?: ColorValue,
//     listStyle?: ViewStyle,
//     inputContainerStyle?: ViewStyle,
//     renderItem?: ( value: any ) => JSX.Element,
//     height?: number,
//     flatListProps?: any,
//     renderTextInput?: ( ) => JSX.Element,
//     hideResults?: boolean,
//     data?: any,
//     defaultValue?: string,
//     maxListHeight?: number
// }


const STYLES = {
    outerContainerStyle: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 100,
        position: 'absolute',
    } as ViewStyle,
    listStyle: { 
        maxHeight: 100,
        borderColor: "rgba(0,0,0,0)", 
        backgroundColor: "rgba(0,0,0,0)"
    } as ViewStyle,
    inputContainerStyle: { 
        borderColor: "rgba(0,0,0,0)",
        backgroundColor: "rgba(0,0,0,0)", 
        borderWidth: StyleSheet.hairlineWidth 
    } as ViewStyle
}

export const AutoCompleteInput = ( props ) => {
    const {
        outerContainerStyle,
        placeholder,
        placeholderTextColor,
        listStyle,
        inputContainerStyle,
        renderItem,
        flatListProps,
        renderTextInput,
        hideResults,
        data,
        defaultValue,
        maxListHeight,
    } = props

    const finalListStyle = maxListHeight ? {...listStyle, maxHeight: maxListHeight } : listStyle

    return (
        <View>
            <AutoComplete 
                data={data}
                hideResults={hideResults}
                defaultValue={defaultValue}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                renderTextInput={renderTextInput}
                flatListProps={flatListProps}
                listStyle={finalListStyle}
                inputContainerStyle={inputContainerStyle}
                renderItem={renderItem}
            />
        </View>
    )
}

AutoCompleteInput.defaultProps = {
    outerContainerStyle: STYLES.outerContainerStyle,
    placeholder: 'Enter Observation ...',
    placeholderTextColor: 'rgba(0,0,0,1)',
    listStyle: STYLES.listStyle,
    inputContainerStyle: STYLES.inputContainerStyle
}

